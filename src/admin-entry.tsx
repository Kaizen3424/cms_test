import { mountAdmin } from "@mycms/admin"
import "@mycms/admin/styles.css"
import { travelAdminConfig } from "./cms/config"

export const REPOSITORY = {
  owner: "Kaizen3424",
  repo: "cms_test",
  branch: "main",
} as const

function bootAdmin() {
  const root = document.getElementById("root")
  if (!root) throw new Error("Root element missing")

  // Clean navigation bar linking back to blog and to GitHub
  const navContainer = document.createElement("header")
  navContainer.className =
    "sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0c1322] border-b border-slate-800 text-sm shadow-md"

  navContainer.innerHTML = `
    <div class="flex items-center gap-4">
      <a href="/" class="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Travel Blog
      </a>
      <span class="text-slate-700">|</span>
      <span class="font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        GitHub Target: <span class="font-mono text-xs text-amber-300">Kaizen3424/cms_test</span> (<span class="font-mono text-xs text-slate-400">main</span>)
      </span>
    </div>
    <div class="flex items-center gap-3">
      <a href="https://github.com/Kaizen3424/cms_test" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        View Repo on GitHub
      </a>
    </div>
  `

  const adminContainer = document.createElement("div")
  adminContainer.id = "admin-app"
  adminContainer.className = "flex-1 min-h-[calc(100vh-53px)]"

  root.replaceChildren(navContainer, adminContainer)

  // Mount Admin directly against real GitHub target
  mountAdmin(adminContainer, {
    config: travelAdminConfig,
    support: { name: "Travel Blog Lead" },
    repository: REPOSITORY,
  })
}

bootAdmin()
