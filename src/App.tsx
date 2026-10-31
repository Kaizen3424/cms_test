import React, { useState } from "react"
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Mail,
  ChevronRight,
  ExternalLink,
  Sliders,
  X,
  Share2,
  Heart,
  Globe,
} from "lucide-react"
import { posts, destinations, settings, author, type Post, type Destination } from "./data"

export function App() {
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [activeStory, setActiveStory] = useState<Post | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  // Collect all unique tags from posts
  const allTags = ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags ?? [])))]

  // Filter posts based on selected tag
  const filteredPosts =
    selectedTag === "All"
      ? posts
      : posts.filter((p) => p.tags?.includes(selectedTag))

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setSubscribed(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* ─── Top Announcement Bar ─── */}
      <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border-b border-amber-800/30 px-4 py-2 text-center text-xs tracking-wide text-amber-200/90 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium text-[11px] border border-amber-500/30">
          <Sparkles className="w-3 h-3 text-amber-400" /> Phase 6 Integration Demo
        </span>
        <span>Content powered by <strong>MyCMS</strong> · Git-backed & Zero Database</span>
        <a
          href="/admin.html"
          className="underline font-semibold hover:text-white transition-colors ml-2 flex items-center gap-1"
        >
          Open CMS Studio <ArrowRight className="w-3 h-3 inline" />
        </a>
      </div>

      {/* ─── Main Navigation ─── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070b14]/85 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <a href="#" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {settings.siteTitle}
              </a>
              <p className="text-[11px] uppercase tracking-wider text-amber-400/80 font-medium">
                Field Notes & Dispatches
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#stories" className="hover:text-amber-400 transition-colors">
              Dispatches
            </a>
            <a href="#destinations" className="hover:text-amber-400 transition-colors">
              Destinations
            </a>
            <a href="#about" className="hover:text-amber-400 transition-colors">
              The Explorer
            </a>
            <a href="#tips" className="hover:text-amber-400 transition-colors">
              Travel Philosophy
            </a>
            <a href="#newsletter" className="hover:text-amber-400 transition-colors">
              Dispatch Club
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/admin.html"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Studio / CMS Admin</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <img
            src={settings.heroImage || "/images/destinations/dolomites-hero.svg"}
            alt="Hero landscape"
            className="w-full h-full object-cover object-center filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-300 text-xs font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Autumn 2026 Expeditions Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              {settings.heroHeading}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8">
              {settings.heroSubheading}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#stories"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Read Field Stories
              </a>
              <a
                href="#destinations"
                className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                Explore {destinations.length} Destinations
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            {settings.stats?.map((stat, idx) => (
              <div key={idx} className="text-center md:text-left md:px-4">
                <div className="text-2xl lg:text-3xl font-extrabold text-amber-400">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest Stories Section ─── */}
      <section id="stories" className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Recent Dispatches
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
              Field Notes from the Trail
            </h2>
          </div>

          {/* Tag Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const dest = destinations.find((d) => d.id === post.destination)
            return (
              <article
                key={post.id}
                onClick={() => setActiveStory(post)}
                className="group cursor-pointer flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={post.coverImage || "/images/destinations/dolomites-hero.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                      Featured Dispatch
                    </span>
                  )}
                  {dest && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 backdrop-blur-sm text-slate-200 border border-white/10 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {dest.name.split(",")[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {post.readingTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                    <span className="text-xs text-slate-400">
                      By <strong className="text-slate-200">{post.author}</strong>
                    </span>
                    <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read notes <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ─── Curated Destinations Section ─── */}
      <section id="destinations" className="py-20 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Field Guides
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Curated Mountain & Cultural Havens
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every location has been scouted on foot. Detailed field reports with optimum seasons, packing requirements, and secret sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="rounded-2xl bg-[#0b101d] border border-slate-800/90 overflow-hidden flex flex-col lg:flex-row group hover:border-amber-500/30 transition-all"
              >
                <div className="lg:w-2/5 relative min-h-[200px] overflow-hidden bg-slate-900">
                  <img
                    src={dest.heroImage || "/images/destinations/dolomites-hero.svg"}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                    {dest.country}
                  </div>
                </div>

                <div className="lg:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{dest.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-3">
                      {dest.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {dest.highlights?.slice(0, 3).map((hl, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Best Season:</span>{" "}
                      <span className="text-amber-300 font-medium">{dest.bestTimeToVisit?.split(" ")[0]}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Climate:</span>{" "}
                      <span className="text-slate-300">{dest.climate?.split(" ")[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Explorer (About Maya) ─── */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#090e1c] to-[#070b14] border border-slate-800 p-8 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl mb-6 bg-slate-900">
                <img
                  src={author.avatar || "/images/author/maya-lin.svg"}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-amber-300 border border-slate-700 mb-2">
                <MapPin className="w-3 h-3 text-amber-400" />
                {author.location}
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
                Behind the Lens
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">{author.name}</h2>
              <p className="text-amber-200/90 text-sm font-medium mb-6">{author.role}</p>

              <p className="text-slate-300 text-base leading-relaxed mb-6">{author.bio}</p>

              {author.quote && (
                <blockquote className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-amber-500 text-sm text-slate-300 italic mb-6">
                  "{author.quote}"
                </blockquote>
              )}

              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-6 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500 block mb-1">Essential Field Gear</span>
                  <span className="text-slate-200 font-medium">{author.gear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Travel Philosophy / Tips ─── */}
      <section id="tips" className="py-20 bg-slate-950/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Our Principles
            </div>
            <h2 className="text-3xl font-extrabold text-white">Mindful Travel Manifesto</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Slow Down & Stay Longer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We believe in staying in one village for weeks rather than checking off five cities in a weekend. True understanding comes with lingering.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Presence Over Content</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Never allow capturing a photograph to eclipse experiencing the sacred moment. We honor local customs and request consent before photographing human faces.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Direct Guild Support</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                100% of our accommodation and culinary spending goes to independent, generational family artisans, mountain rifugios, and local craftspeople.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter Dispatch Box ─── */}
      <section id="newsletter" className="py-20 max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-600/30 p-8 md:p-14 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-3">
            Receive the Sunday Field Dispatch
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8">
            One quiet postcard delivered every Sunday dawn. Unreleased coordinates, route maps, and unfiltered field journals. Zero spam, ever.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Welcome to the trail! Your first dispatch will arrive Sunday morning.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all"
              >
                Join Dispatch
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800 bg-[#05070e] py-12 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-300 font-semibold">{settings.siteTitle}</span>
              <p className="text-xs text-slate-500">{settings.footerText}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#stories" className="hover:text-amber-400">Dispatches</a>
            <a href="#destinations" className="hover:text-amber-400">Destinations</a>
            <a href="/admin.html" className="text-amber-400 hover:underline flex items-center gap-1">
              CMS Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* ─── Story Reader Modal ─── */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c1220] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header Image */}
            <div className="relative aspect-[21/9] bg-slate-950">
              <img
                src={activeStory.coverImage || "/images/destinations/dolomites-hero.svg"}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-transparent to-transparent" />
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 flex-1">
              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-400 font-medium">
                <span>{activeStory.readingTime}</span>
                <span>•</span>
                <span>{activeStory.publishDate ? new Date(activeStory.publishDate).toLocaleDateString("en-US", { dateStyle: "long" }) : ""}</span>
                <span>•</span>
                <span className="text-slate-300">By {activeStory.author}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {activeStory.title}
              </h2>

              <p className="text-base text-amber-200/90 font-medium italic border-l-2 border-amber-500 pl-4 py-1">
                {activeStory.excerpt}
              </p>

              <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line space-y-4">
                {activeStory.content}
              </div>

              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {activeStory.tags?.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300">
                      #{t}
                    </span>
                  ))}
                </div>

                <a
                  href="/admin.html"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Edit this story in MyCMS Studio <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
