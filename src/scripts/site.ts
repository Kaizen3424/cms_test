/**
 * site.ts — vanilla behaviours shared by every page (no React, no hydration):
 * the three-state theme toggle, nav material swap on scroll, count-up stats
 * and staggered scroll reveals. duration/easing tokens come from theme.css.
 *
 * Motion principle (Apple → Interruptibility): these are one-shot entrances
 * and continuous feedback; interactive springs live in the React islands.
 */
import { animate, inView } from "motion"

const STORAGE_KEY = "theme"
type ThemeChoice = "light" | "dark" | "system"
const CHOICES: readonly ThemeChoice[] = ["light", "dark", "system"]

function readStored(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "dark" || stored === "light" ? stored : "system"
  } catch {
    return "system"
  }
}

function resolve(choice: ThemeChoice): "light" | "dark" {
  if (choice !== "system") return choice
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function apply(resolved: "light" | "dark"): void {
  const root = document.documentElement
  root.dataset.theme = resolved
  root.style.colorScheme = resolved
}

function initThemeToggle(): void {
  const group = document.querySelector("[data-theme-toggle]")
  if (group === null) return

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>("[data-theme-choice]"))
  if (buttons.length === 0) return

  const reflect = (choice: ThemeChoice): void => {
    for (const button of buttons) {
      const isCurrent = button.dataset.themeChoice === choice
      button.setAttribute("aria-checked", String(isCurrent))
      button.classList.toggle("theme-toggle-btn-active", isCurrent)
    }
  }

  let choice = readStored()
  reflect(choice)

  const media = window.matchMedia("(prefers-color-scheme: dark)")
  const followSystem = (): void => {
    if (choice === "system") apply(media.matches ? "dark" : "light")
  }
  media.addEventListener("change", followSystem)

  group.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null
    const button = target?.closest<HTMLButtonElement>("[data-theme-choice]")
    if (button === null || button === undefined) return
    const value = button.dataset.themeChoice
    if (value !== "light" && value !== "dark" && value !== "system") return
    choice = value
    reflect(choice)
    apply(resolve(choice))
    try {
      if (choice === "system") localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* private mode — the choice still holds for this visit */
    }
  })
  void CHOICES // (documents the accepted values)
}

/** Nav: switch from transparent to the thick material once content scrolls under it. */
function initNavScroll(): void {
  const nav = document.querySelector<HTMLElement>("[data-nav]")
  if (nav === null) return
  const update = (): void => {
    nav.classList.toggle("nav-scrolled", window.scrollY > 8)
  }
  update()
  window.addEventListener("scroll", update, { passive: true })
}

/** Count-ups: animate the numeric lead-in of stats like "38+" or "4,200+". */
function initCountUps(): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  document.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
    const format = el.dataset.countupFormat ?? "plain"
    const match = el.textContent?.match(/^([\d,.]+)(.*)$/)
    if (match === null || reduced) return
    const suffix = match[2]
    const raw = match[1]
    const decimals = raw.includes(".") ? (raw.split(".")[1]?.length ?? 0) : 0
    const thousands = raw.includes(",")
    const original = Number.parseFloat(raw.replace(/,/g, ""))
    if (!Number.isFinite(original)) return
    const render = (value: number): string => {
      const formatted = thousands ? value.toLocaleString("en-US", { maximumFractionDigits: decimals }) : value.toFixed(decimals)
      return format === "plain" ? `${formatted}${suffix}` : `${formatted}${suffix}`
    }
    el.textContent = render(original)
    inView(el, () => {
      animate(0, original, {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (value) => {
          el.textContent = render(value)
        },
      })
      return () => {
        el.textContent = render(original)
      }
    })
  })
}

/** Scroll reveals — CSS may pre-hide; the observer guarantees they land. */
function initReveals(): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) {
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "1"
    })
    return
  }
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const delay = Number.parseFloat(el.dataset.revealDelay ?? "0")
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [14, 0] }, { duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] })
      return () => {}
    })
  })
}

initThemeToggle()
initNavScroll()
initCountUps()
initReveals()
