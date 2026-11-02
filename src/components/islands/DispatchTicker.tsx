/**
 * DispatchTicker — the hero's signature interactive card (the Wise-design
 * converter-card analog): cycles featured dispatches with springs, pauses on
 * hover/focus, and opens the full story route on tap.
 *
 * Momentum care: cards swap on a timeline, so `popLayout` + a critically
 * damped default spring; the little overshoot stays only for the flick of
 * manual prev/next where the user's gesture carried momentum.
 */
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { formatDate } from "../../lib/format"
import type { StoryPost } from "./StoryBrowser"

const AUTO_ADVANCE_MS = 5600

export default function DispatchTicker({ stories, heroFallback }: { stories: StoryPost[]; heroFallback: string }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = stories.length
  const timerRef = useRef<number | undefined>(undefined)

  const go = useCallback(
    (step: number) => {
      setDirection(step > 0 ? 1 : -1)
      setIndex((i) => (i + step + count) % count)
    },
    [count],
  )

  // Auto-advance: pause on hover/focus (Apple → Agency: the user is in control).
  useEffect(() => {
    if (paused || count === 0) return
    timerRef.current = window.setInterval(() => go(1), AUTO_ADVANCE_MS)
    return () => window.clearInterval(timerRef.current)
  }, [paused, count, go, index])

  if (count === 0) return null
  const story = stories[index]
  const hasMultiple = count > 1

  const jumpTo = (): void => {
    window.location.assign(`/journal/${story.id}/`)
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        aria-label="Featured dispatches"
        className="relative flex max-w-md flex-col overflow-hidden rounded-2xl bg-canvas text-ink shadow-e2"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative aspect-[16/10] select-none bg-canvas-soft">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={story.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 42 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -42 }}
              transition={direction === 0 ? { type: "spring", bounce: 0, duration: 0.4 } : { type: "spring", bounce: 0.18, duration: 0.45 }}
              className="absolute inset-0"
            >
              <img
                src={story.coverImage ?? heroFallback}
                alt={story.title}
                className="h-full w-full cursor-pointer object-cover"
                onClick={jumpTo}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgb(11 13 10 / 78%) 0%, transparent 55%)" }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-on-solid">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={story.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="flex items-center gap-1.5 text-[11px] font-medium"
              >
                <Clock className="h-3 w-3 text-primary" aria-hidden />
                {story.readingTime ?? "5 min read"} · {formatDate(story.publishDate)}
              </motion.span>
            </AnimatePresence>

            {hasMultiple ? (
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  className="pressable material grid h-7 w-7 place-items-center rounded-full border border-hairline"
                  onClick={() => go(-1)}
                  aria-label="Previous featured dispatch"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="pressable material grid h-7 w-7 place-items-center rounded-full border border-hairline"
                  onClick={() => go(1)}
                  aria-label="Next featured dispatch"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <span className="t-eyebrow text-positive-strong">Live from the field</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h3
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="text-lg leading-snug font-bold"
            >
              {story.title}
            </motion.h3>
          </AnimatePresence>
          <p className="line-clamp-2 text-sm text-body">{story.excerpt}</p>

          <button
            type="button"
            onClick={jumpTo}
            className="pressable mt-1 inline-flex w-fit items-center gap-2 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-active"
          >
            Read dispatch <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>

        {hasMultiple ? (
          <div className="flex items-center justify-center gap-1.5 pb-5">
            {stories.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show featured dispatch ${i + 1}: ${s.title}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className={`h-1.5 rounded-pill transition-all ${
                  i === index ? "w-5 bg-positive-strong" : "w-1.5 bg-hairline-strong hover:bg-mute"
                }`}
              />
            ))}
          </div>
        ) : null}
      </motion.section>
    </MotionConfig>
  )
}
