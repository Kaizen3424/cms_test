/**
 * Admin host — mounts the example panel (copied from the patcms playground)
 * against the real repository target. The panel imports only `patcms` and
 * `patcms/web`; everything else here is page chrome.
 */
import { createIdbDraftStore, createIdbTokenStore } from "patcms/web"
import { mountPanel } from "./panel"
import { travelConfig } from "./cms/config"

export const REPOSITORY = {
  owner: "Kaizen3424",
  repo: "cms_test",
  branch: "main",
} as const

function bootAdmin() {
  const root = document.getElementById("root")
  if (!root) throw new Error("Root element missing")

  const nav = document.createElement("header")
  nav.className =
    "sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0c1322] border-b border-slate-800 text-sm shadow-md"

  const left = document.createElement("div")
  left.className = "flex items-center gap-4"
  const backLink = document.createElement("a")
  backLink.href = "/"
  backLink.className =
    "flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
  backLink.textContent = "← Back to Travel Blog"
  const target = document.createElement("span")
  target.className = "font-semibold text-slate-200 flex items-center gap-2"
  target.textContent = "GitHub Target: Kaizen3424/cms_test (main)"
  left.append(backLink, target)

  const right = document.createElement("div")
  right.className = "flex items-center gap-3"
  const repoLink = document.createElement("a")
  repoLink.href = "https://github.com/Kaizen3424/cms_test"
  repoLink.target = "_blank"
  repoLink.rel = "noopener noreferrer"
  repoLink.className =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
  repoLink.textContent = "View Repo on GitHub"
  right.append(repoLink)

  nav.append(left, right)

  const panelHost = document.createElement("div")
  panelHost.id = "admin-app"
  panelHost.className = "flex-1 min-h-[calc(100vh-53px)]"

  root.replaceChildren(nav, panelHost)

  mountPanel(panelHost, {
    config: travelConfig,
    repository: REPOSITORY,
    tokenStore: createIdbTokenStore(),
    drafts: createIdbDraftStore(),
    title: "Wanderlust Chronicles · patcms",
  })
}

bootAdmin()
