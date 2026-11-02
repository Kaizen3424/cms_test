/** Date + misc formatting shared by Astro server code and React islands. */
export function formatDate(value: string | undefined | null, style: "short" | "long" = "short"): string {
  if (value === undefined || value === null || value === "") return style === "short" ? "Recent" : ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return style === "short" ? "Recent" : ""
  return new Intl.DateTimeFormat("en-US", style === "short"
    ? { month: "short", day: "numeric", year: "numeric" }
    : { dateStyle: "long" }).format(date)
}
