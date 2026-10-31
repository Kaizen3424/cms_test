import authorData from "../content/author.json"
import settingsData from "../content/settings.json"

export interface Post {
  readonly id: string
  readonly title: string
  readonly slug: string
  readonly excerpt: string
  readonly content: string
  readonly coverImage?: string
  readonly destination?: string
  readonly author?: string
  readonly readingTime?: string
  readonly featured?: boolean
  readonly tags?: readonly string[]
  readonly publishDate?: string
}

export interface Destination {
  readonly id: string
  readonly name: string
  readonly country: string
  readonly description: string
  readonly heroImage?: string
  readonly bestTimeToVisit?: string
  readonly climate?: string
  readonly highlights?: readonly string[]
}

export interface SiteSettings {
  readonly siteTitle: string
  readonly tagline: string
  readonly heroHeading: string
  readonly heroSubheading: string
  readonly heroImage?: string
  readonly contactEmail?: string
  readonly footerText?: string
  readonly stats?: readonly { readonly label: string; readonly value: string }[]
}

export interface AuthorProfile {
  readonly name: string
  readonly role: string
  readonly bio: string
  readonly avatar?: string
  readonly quote?: string
  readonly location?: string
  readonly gear?: string
}

// Eagerly import all JSON entries using Vite's glob import
const postModules = import.meta.glob("../content/posts/*.json", { eager: true, import: "default" }) as Record<
  string,
  Omit<Post, "id">
>
const destinationModules = import.meta.glob("../content/destinations/*.json", { eager: true, import: "default" }) as Record<
  string,
  Omit<Destination, "id">
>

export const posts: Post[] = Object.entries(postModules).map(([filePath, data]) => {
  const filename = filePath.split("/").pop()?.replace(/\.json$/, "") ?? ""
  return {
    id: filename,
    ...data,
  }
})

export const destinations: Destination[] = Object.entries(destinationModules).map(([filePath, data]) => {
  const filename = filePath.split("/").pop()?.replace(/\.json$/, "") ?? ""
  return {
    id: filename,
    ...data,
  }
})

export const settings: SiteSettings = settingsData as SiteSettings
export const author: AuthorProfile = authorData as AuthorProfile
