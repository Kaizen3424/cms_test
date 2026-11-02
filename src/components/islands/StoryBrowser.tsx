/**
 * StoryBrowser — the stories grid island (astro → React, client:visible).
 * Server-rendered cards arrive in the HTML for SEO; on hydration the island
 * tags springs onto filter transitions and the modal reader.
 *
 * Motion rules (apple-design): press feedback on pointer-down via CSS;
 * modal = scale-in spring (damping 1.0 comeback, bounce 0 — a popup carries
 * no momentum); filters reshuffle with layout springs; every transition is
 * interruptible by new input (Motion springs animate from the live value).
 */
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { Calendar, CheckCircle2, ChevronRight, Clock, MapPin, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { formatDate } from "../../lib/format"

export interface StoryPost {
  readonly id: string
  readonly title: string
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

export interface DestinationStub {
  readonly id: string
  readonly name: string
}

export default function StoryBrowser({
  posts,
  destinations,
  heroFallback,
}: {
  posts: StoryPost[]
  destinations: DestinationStub[]
  heroFallback: string
}) {
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [active, setActive] = useState<StoryPost | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const destinationName = useCallback(
    (id: string | undefined) =>
      id === undefined ? undefined : destinations.find((d) => d.id === id)?.name,
    [destinations],
  )

  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags ?? [])))],
    [posts],
  )

  const filtered = useMemo(
    () => (selectedTag === "All" ? posts : posts.filter((p) => p.tags?.includes(selectedTag))),
    [posts, selectedTag],
  )

  // Story routes link is /#story-<slug> — same depth the CMS preview uses.
  useEffect(() => {
    const openFromHash = (): void => {
      const match = window.location.hash.match(/^#story-(.+)$/)
      const found = match === null ? undefined : posts.find((p) => p.id === match[1])
      if (found !== undefined) setActive(found)
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [posts])

  // Escape closes; body scroll locks while the reader is open.
  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setActive(null)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [active])

  const close = useCallback((): void => {
    setActive(null)
    if (window.location.hash.startsWith("#story-")) {
      history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {/* Filter pills */}
      <div className="flex max-w-full flex-wrap gap-2" role="tablist" aria-label="Filter dispatches by topic">
        {allTags.map((tag) => {
          const isActive = selectedTag === tag
          return (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`pressable rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-on-primary shadow-e1"
                  : "bg-canvas text-body shadow-e1 hover:bg-canvas-soft-warm"
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((post) => {
            const dest = destinationName(post.destination)
            return (
              <motion.li
                key={post.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <article
                  className="pressable group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-canvas shadow-e1 transition-shadow hover:shadow-e2"
                  onClick={() => setActive(post)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-canvas-soft">
                    <img
                      src={post.coverImage ?? heroFallback}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    {post.featured ? (
                      <span className="absolute top-3 left-3 rounded-pill bg-primary-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-positive-deep">
                        Featured dispatch
                      </span>
                    ) : null}
                    {dest ? (
                      <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-pill border border-hairline bg-scrim/60 px-2 py-0.5 text-[11px] font-medium text-on-solid backdrop-blur">
                        <MapPin className="h-3 w-3 text-primary" aria-hidden />
                        {dest.split(",")[0]}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-3 text-xs text-mute">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-positive-strong" aria-hidden />
                        {post.readingTime ?? "5 min read"}
                      </span>
                      <span aria-hidden>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden />
                        {formatDate(post.publishDate)}
                      </span>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-xl leading-snug font-bold text-ink transition-colors group-hover:text-positive-strong">
                      {post.title}
                    </h3>

                    <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-body">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4">
                      <span className="text-xs text-mute">
                        By <strong className="text-body">{post.author ?? "Wanderlust"}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-positive-strong transition-transform group-hover:translate-x-1">
                        Read notes <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>

      {/* Reader modal */}
      <AnimatePresence>
        {active !== null ? (
          <motion.div
            key="reader"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: "rgb(11 13 10 / 72%)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-canvas shadow-e3"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ type: "spring", bounce: 0, duration: 0.38 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[21/9] bg-canvas-soft">
                <img
                  src={active.coverImage ?? heroFallback}
                  alt={active.title}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--canvas) 0%, transparent 45%)" }}
                />
                <button
                  ref={closeRef}
                  onClick={close}
                  className="pressable material absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-hairline"
                  aria-label="Close story reader"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-positive-strong">
                  <span>{active.readingTime ?? "5 min read"}</span>
                  <span aria-hidden>•</span>
                  <span>{formatDate(active.publishDate, "long")}</span>
                  <span aria-hidden>•</span>
                  <span className="text-body">By {active.author ?? "Wanderlust"}</span>
                </div>

                <h2 className="t-display-sm text-ink">{active.title}</h2>

                <p className="border-l-2 border-primary py-1 pl-4 font-medium text-body italic">
                  {active.excerpt}
                </p>

                <div className="space-y-4 text-base leading-relaxed whitespace-pre-line text-body">
                  {active.content}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {active.tags?.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1 rounded-md bg-canvas-soft px-2.5 py-1 text-[11px] text-body"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`/journal/${active.id}/`}
                    className="pressable flex items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-active"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    Open full article
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  )
}
