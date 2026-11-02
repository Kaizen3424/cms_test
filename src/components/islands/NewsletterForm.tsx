/**
 * NewsletterForm — "Dispatch Club" island (client:visible). A real-blog
 * touch: optimistic local state now; hook up a real mailbox provider later.
 */
import { CheckCircle2, Mail } from "lucide-react"
import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  if (subscribed) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-positive/40 bg-positive/10 px-4 py-4 text-sm font-medium text-positive-strong">
        <CheckCircle2 className="h-5 w-5" aria-hidden />
        Welcome to the trail! Your first dispatch will arrive Sunday morning.
      </div>
    )
  }

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        if (email.trim()) setSubscribed(true)
      }}
    >
      <label className="sr-only" htmlFor="dispatch-email">
        Email address
      </label>
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
        <input
          id="dispatch-email"
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-hairline bg-canvas px-11 py-3 text-sm text-ink transition-colors placeholder:text-mute focus:border-primary focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="pressable rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-active"
      >
        Join Dispatch
      </button>
    </form>
  )
}
