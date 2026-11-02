/**
 * site-content.ts — the site-level singletons (settings + author profile)
 * which the CMS writes to `content/settings.json` / `content/author.json`.
 * Plain JSON imports: the CMS committed these files; Astro reimports on the
 * next rebuild after a save. (Posts/destinations use the content collections
 * instead, because they are folder sets.)
 */
import settingsJson from "../../content/settings.json"
import authorJson from "../../content/author.json"
import type { AuthorProfile, SiteSettings } from "../content.config"

export const settings = settingsJson as unknown as SiteSettings
export const author = authorJson as unknown as AuthorProfile

export const heroFallback = "/images/destinations/dolomites-hero.svg"
