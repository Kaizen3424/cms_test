import { mountAdmin } from "@mycms/admin"
import "@mycms/admin/styles.css"
import { travelAdminConfig } from "./cms/config"
import {
  createSandboxFetch,
  createSeededSandboxServer,
  DEFAULT_SANDBOX_REPO,
  type SeedFile,
} from "./cms/sandbox"

// Eagerly import all content files from disk as raw text
const rawContentFiles = import.meta.glob("../content/**/*.json", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>

const seedFiles: SeedFile[] = Object.entries(rawContentFiles).map(([rawPath, content]) => {
  // Normalize "../content/posts/x.json" -> "content/posts/x.json"
  const normalizedPath = rawPath.replace(/^\.\.\//, "").replace(/^\//, "")
  return {
    path: normalizedPath,
    content,
  }
})

async function bootAdmin() {
  const root = document.getElementById("root")
  if (!root) throw new Error("Root element missing")

  // Check URL params for mode toggle
  const params = new URLSearchParams(window.location.search)
  const isRealGithub = params.get("mode") === "github"

  // Render navigation & mode switcher header
  const navContainer = document.createElement("header")
  navContainer.className =
    "sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0c1322] border-b border-slate-800 text-sm"

  navContainer.innerHTML = `
    <div class="flex items-center gap-4">
      <a href="/" class="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Travel Blog
      </a>
      <span class="text-slate-600">|</span>
      <span class="font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full ${isRealGithub ? "bg-emerald-400" : "bg-amber-400"} animate-pulse"></span>
        ${isRealGithub ? "Real GitHub Target" : "Local Sandbox Mode (Pre-seeded)"}
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-400 hidden sm:inline">
        ${isRealGithub ? "Connecting to api.github.com" : "Offline sandbox · Simulated GitHub API"}
      </span>
      <button id="toggle-mode-btn" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer">
        Switch to ${isRealGithub ? "Sandbox Mode" : "Real GitHub Mode"}
      </button>
    </div>
  `

  const adminContainer = document.createElement("div")
  adminContainer.id = "admin-app"
  adminContainer.className = "flex-1 min-h-[calc(100vh-53px)]"

  root.replaceChildren(navContainer, adminContainer)

  document.getElementById("toggle-mode-btn")?.addEventListener("click", () => {
    const nextMode = isRealGithub ? "sandbox" : "github"
    params.set("mode", nextMode)
    window.location.search = params.toString()
  })

  if (isRealGithub) {
    // Real GitHub mode: uses default fetch to api.github.com
    mountAdmin(adminContainer, {
      config: travelAdminConfig,
      support: { name: "Travel Blog Lead" },
      repository: {
        owner: params.get("owner") || DEFAULT_SANDBOX_REPO.owner,
        repo: params.get("repo") || DEFAULT_SANDBOX_REPO.repo,
        branch: params.get("branch") || DEFAULT_SANDBOX_REPO.branch,
      },
    })
  } else {
    // Sandbox mode: in-memory FakeGithubServer pre-seeded with all travel blog files
    const server = await createSeededSandboxServer(seedFiles, DEFAULT_SANDBOX_REPO)
    const sandboxFetch = createSandboxFetch(server, DEFAULT_SANDBOX_REPO)

    mountAdmin(adminContainer, {
      config: travelAdminConfig,
      support: { name: "Travel Blog Lead" },
      repository: DEFAULT_SANDBOX_REPO,
      fetch: sandboxFetch,
    })
  }
}

bootAdmin().catch((err) => {
  console.error("Admin initialization error:", err)
})
