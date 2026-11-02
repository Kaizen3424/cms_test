/**
 * repo.ts — the single GitHub target for this deployment's CMS: the same
 * repository that Cloudflare Pages builds from, so a saved commit is a
 * deployed site.
 */
export const repository = {
  owner: "Kaizen3424",
  repo: "cms_test",
  branch: "main",
} as const

export const githubBackLink = `https://github.com/${repository.owner}/${repository.repo}`
