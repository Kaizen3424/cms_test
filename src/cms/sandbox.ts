import {
  FakeGithubServer,
  gitBlobSha,
  gitTreeSha,
  type FetchLike,
  type FetchRequestInitLike,
  type FetchResponseLike,
  type GitTreeEntry,
} from "@mycms/core"

export interface SandboxConfig {
  readonly owner: string
  readonly repo: string
  readonly branch: string
}

export const DEFAULT_SANDBOX_REPO: SandboxConfig = {
  owner: "maya-lin",
  repo: "wanderlust-chronicles",
  branch: "main",
}

export interface SeedFile {
  readonly path: string
  readonly content: string
}

/** Builds a FakeGithubServer seeded with the site's initial content files. */
export async function createSeededSandboxServer(
  files: readonly SeedFile[],
  config: SandboxConfig = DEFAULT_SANDBOX_REPO,
): Promise<FakeGithubServer> {
  const encoder = new TextEncoder()
  const fileMap = new Map<string, { sha: string; bytes: Uint8Array }>()
  const treeEntries: GitTreeEntry[] = []

  for (const file of files) {
    const bytes = encoder.encode(file.content)
    const sha = await gitBlobSha(bytes)
    fileMap.set(file.path, { sha, bytes })
    treeEntries.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha,
      size: bytes.byteLength,
    })
  }

  const treeSha = await gitTreeSha(treeEntries)
  // Deterministic 40-hex initial commit sha
  const headSha = treeSha.split("").reverse().join("")

  const server = new FakeGithubServer({
    defaultBranch: config.branch,
    headSha,
    treeSha,
    files: fileMap,
  })

  return server
}

function toFetchResponse(
  status: number,
  json: unknown,
  customHeaders: Record<string, string> = {},
): FetchResponseLike {
  const headersRecord: Record<string, string> = {
    "x-ratelimit-limit": "5000",
    "x-ratelimit-remaining": "4999",
    "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 3600),
    "content-type": "application/json; charset=utf-8",
    ...customHeaders,
  }

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : status === 404 ? "Not Found" : String(status),
    headers: {
      get(name: string) {
        const lower = name.toLowerCase()
        return headersRecord[lower] ?? null
      },
    },
    async json() {
      return json
    },
    async text() {
      return typeof json === "string" ? json : JSON.stringify(json)
    },
  }
}

/**
 * Creates an injectable FetchLike transport that dispatches GitHub API calls
 * to the in-memory FakeGithubServer.
 */
export function createSandboxFetch(
  server: FakeGithubServer,
  config: SandboxConfig = DEFAULT_SANDBOX_REPO,
): FetchLike {
  const repoPrefix = `/repos/${config.owner}/${config.repo}`

  return async (input: string, init?: FetchRequestInitLike): Promise<FetchResponseLike> => {
    const url = new URL(input, "https://api.github.com")
    const method = (init?.method ?? "GET").toUpperCase()

    // Pass through non-GitHub requests (e.g. local assets / images)
    if (url.origin !== "https://api.github.com") {
      const res = await globalThis.fetch(input, init as RequestInit)
      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: {
          get(name: string) {
            return res.headers.get(name)
          },
        },
        async json() {
          return res.json()
        },
        async text() {
          return res.text()
        },
      }
    }

    // Rate limit endpoint
    if (url.pathname === "/rate_limit") {
      return toFetchResponse(200, {
        resources: {
          core: {
            limit: 5000,
            remaining: 4999,
            reset: Math.floor(Date.now() / 1000) + 3600,
          },
        },
      })
    }

    // Repository probe
    if (url.pathname === repoPrefix) {
      return toFetchResponse(200, {
        name: config.repo,
        full_name: `${config.owner}/${config.repo}`,
        default_branch: config.branch,
        private: true,
        permissions: { admin: true, push: true, pull: true },
      })
    }

    // Branch protection probe
    if (url.pathname === `${repoPrefix}/branches/${config.branch}/protection`) {
      return toFetchResponse(200, { required_status_checks: null })
    }

    // Ref GET: /repos/{owner}/{repo}/git/ref/heads/{branch} or /git/refs/heads/{branch}
    if (url.pathname.startsWith(`${repoPrefix}/git/ref`)) {
      const parts = url.pathname.split("/")
      const branch = parts[parts.length - 1] ?? config.branch
      const sha = server.ref(branch) ?? "0000000000000000000000000000000000000000"
      return toFetchResponse(200, {
        ref: `refs/heads/${branch}`,
        object: { sha, type: "commit" },
      })
    }

    // Parse body for mutations
    let bodyJson: unknown = undefined
    if (init?.body) {
      try {
        if (typeof init.body === "string") {
          bodyJson = JSON.parse(init.body)
        } else if (init.body instanceof Uint8Array) {
          bodyJson = JSON.parse(new TextDecoder().decode(init.body))
        }
      } catch {
        // body remains undefined
      }
    }

    // Check-runs probe
    if (url.pathname.includes("/check-runs")) {
      return toFetchResponse(200, {
        total_count: 1,
        check_runs: [
          {
            id: 1,
            name: "deploy/preview",
            status: "completed",
            conclusion: "success",
          },
        ],
      })
    }

    // Delegate to FakeGithubServer
    if (url.pathname.startsWith(repoPrefix)) {
      const serverPath = url.pathname.slice(repoPrefix.length)
      const fakeRes = await server.handle({
        method,
        path: serverPath,
        headers: init?.headers,
        body: bodyJson,
      })

      const customHeaders = fakeRes.headers ? { ...fakeRes.headers } : {}
      return toFetchResponse(fakeRes.status, fakeRes.json ?? {}, customHeaders)
    }

    return toFetchResponse(404, { message: "Not Found" })
  }
}
