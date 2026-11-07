import Link from 'next/link';
import BreakingTicker from '@/components/BreakingTicker';
import TimeAgo from '@/components/TimeAgo';
import {
  getBreakingNews,
  getLatestNews,
  getLatestShorts,
  getJobListings,
  getMarketplaceListings,
  getActivePosters,
} from '@/lib/news-service';
import { formatTimeAgo, formatEditorialDate, formatFullDateTime } from '@/lib/date-utils';
import { ShortVideo, NewsArticle } from '@/types';
import {
  Flame,
  Play,
  Briefcase,
  ShoppingBag,
  Clock,
  Share2,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  Newspaper,
  Compass,
  Lock,
  Sparkles,
  Megaphone,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [breaking, allArticles, shorts, jobs, marketplace, posters] = await Promise.all([
    getBreakingNews(),
    getLatestNews(36),
    getLatestShorts(8),
    getJobListings(4),
    getMarketplaceListings(3),
    getActivePosters(),
  ]);

  // Lead article from live DB or fallback
  const leadArticle: NewsArticle = allArticles[0] || {
    id: 'corridor-lead',
    title: 'Telangana Cabinet Greenlights ₹24,000 Cr Semiconductor Tech Corridor Near Hyderabad',
    summary:
      'The state government announced a landmark initiative to establish a world-class semiconductor manufacturing hub on the outskirts of Hyderabad, aiming to create over 50,000 direct jobs.',
    category: 'Politics',
    region: 'Telangana',
    author: 'DK Times Editorial',
    publishedAt: new Date().toISOString(),
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  };

  const secondaryArticles = allArticles.slice(1, 4);
  const trendingArticles = allArticles.slice(4, 9);

  // Category-wise filtered sets
  const isMatch = (story: NewsArticle, terms: string[]) => {
    const text = `${story.title} ${story.summary} ${story.category} ${story.region} ${(story.categories || []).join(' ')}`.toLowerCase();
    return terms.some((t) => text.includes(t.toLowerCase()));
  };

  const telanganaStories = allArticles
    .filter((a) => isMatch(a, ['telangana', 'hyderabad', 'తెలంగాణ', 'హైదరాబాద్', 'వరంగల్', 'కేటీఆర్', 'రేవంత్']))
    .slice(0, 4);

  const apStories = allArticles
    .filter((a) => isMatch(a, ['andhra', 'amaravati', 'vijayawada', 'visakhapatnam', 'ఆంధ్ర', 'అమరావతి', 'పవన్', 'చంద్రబాబు', 'వైసీపీ']))
    .slice(0, 4);

  const politicsStories = allArticles
    .filter((a) => isMatch(a, ['politics', 'కాంగ్రెస్', 'బిజెపి', 'బీఆర్ఎస్', 'రాజకీయం', 'మంత్రులు', 'ఎన్నికలు', 'పార్లమెంట్']))
    .slice(0, 4);

  // All remaining news for continuous stream
  const continuousAllNews = allArticles.slice(9, 21);

  return (
    <main>
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-8 sm:space-y-10 md:space-y-12">
        {/* ================= HERO EDITORIAL GRID ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEAD STORY (7 cols) */}
          <div className="lg:col-span-7">
            <article className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm h-full flex flex-col justify-between hover:shadow-md transition">
              <div>
                {/* High-Clarity Framed Image Container */}
                <div className="relative w-full h-[240px] sm:h-[340px] md:h-[400px] bg-neutral-900 overflow-hidden flex items-center justify-center">
                  {leadArticle.imageUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                      style={{ backgroundImage: `url(${leadArticle.imageUrl})` }}
                    />
                  )}
                  <img
                    src={leadArticle.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=85'}
                    alt={leadArticle.title}
                    className="relative z-10 max-h-full max-w-full object-contain sm:object-cover sm:w-full sm:h-full transition duration-500 hover:scale-[1.02]"
                    loading="eager"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.16em] px-2.5 py-1 rounded shadow-sm">
                      Lead Story
                    </span>
                    <span className="bg-[#1C3D5A] dark:bg-sky-600 text-white text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded shadow-sm">
                      {leadArticle.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                  {/* Category & Proper Date / Time */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] mb-2 font-medium text-[#6F675C] dark:text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
                      {leadArticle.region ? `${leadArticle.region} · ` : ''}{leadArticle.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-[#211D18] dark:text-slate-200">
                      <Clock size={12} /> <TimeAgo timestamp={leadArticle.publishedAt} />
                    </span>
                    <span>•</span>
                    <span>{formatEditorialDate(leadArticle.publishedAt)}</span>
                  </div>

                  <Link href={`/article/${leadArticle.id}`}>
                    <h2 className="font-serif font-black text-2xl md:text-3xl lg:text-4xl leading-[1.18] text-[#211D18] dark:text-white hover:text-[#1C3D5A] dark:hover:text-sky-400 transition">
                      {leadArticle.title}
                    </h2>
                  </Link>
                  <p className="text-[#6F675C] dark:text-slate-300 text-sm md:text-base leading-relaxed mt-3 font-normal line-clamp-3">
                    {leadArticle.summary}
                  </p>

                  {/* Prominent Read Full Story Button */}
                  <div className="mt-5">
                    <Link
                      href={`/article/${leadArticle.id}`}
                      className="inline-flex items-center gap-2 bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
                    >
                      Read Full Story <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-6 pt-4 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10 flex items-center justify-between text-xs text-[#6F675C] dark:text-slate-400">
                <div>
                  <span className="font-bold text-[#211D18] dark:text-white">{leadArticle.author || 'DK Times Editorial'}</span>
                  <span className="mx-2">•</span>
                  <span>{formatFullDateTime(leadArticle.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/article/${leadArticle.id}`} className="hover:text-[#1C3D5A] dark:hover:text-sky-400 transition" title="Share">
                    <Share2 size={15} />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* SECONDARY STORIES + TRENDING (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* 3 Stacked Secondary Cards */}
            {secondaryArticles.map((story) => (
              <div
                key={story.id}
                className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-3.5 flex gap-4 shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-[rgba(33,29,24,0.1)] dark:border-white/10 relative">
                  <img
                    src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80'}
                    alt={story.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1">
                      <span className="font-bold uppercase tracking-[0.16em] text-[#1C3D5A] dark:text-sky-400">
                        {story.category || 'News'}
                      </span>
                      <TimeAgo timestamp={story.publishedAt} />
                    </div>
                    <Link href={`/article/${story.id}`}>
                      <h3 className="font-serif font-bold text-sm md:text-base leading-snug text-[#211D18] dark:text-white group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2">
                        {story.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Read More link */}
                  <div className="mt-2 flex items-center justify-end">
                    <Link
                      href={`/article/${story.id}`}
                      className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 group-hover:underline inline-flex items-center gap-1"
                    >
                      Read More <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* TRENDING STORIES WIDGET */}
            <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-5 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={16} className="text-red-500 fill-current" />
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                  Trending Now
                </h3>
              </div>

              <div className="space-y-3">
                {trendingArticles.map((t, idx) => (
                  <div key={t.id} className="border-b border-[rgba(33,29,24,0.06)] dark:border-white/5 pb-3 last:border-0 last:pb-0">
                    <Link href={`/article/${t.id}`} className="flex items-start gap-3 group">
                      <span className="text-lg font-serif font-black text-[#1C3D5A]/40 dark:text-sky-400/40 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition leading-snug line-clamp-2">
                          {t.title}
                        </p>
                        <div className="text-[10px] text-[#6F675C] dark:text-slate-400 mt-1 font-medium">
                          <TimeAgo timestamp={t.publishedAt} />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATEGORY 1: TELANGANA & HYDERABAD ================= */}
        {telanganaStories.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-[#1C3D5A] dark:bg-sky-500 rounded-sm" />
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                    Telangana & Hyderabad
                  </h2>
                  <p className="text-xs text-[#6F675C] dark:text-slate-400">
                    రాష్ట్ర పాలన, రాజధాని విశేషాలు మరియు జిల్లా వార్తలు
                  </p>
                </div>
              </div>
              <Link
                href="/news/telangana"
                className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View All Telangana News <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {telanganaStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                      <img
                        src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                        <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                          {story.region || 'Telangana'}
                        </span>
                        <TimeAgo timestamp={story.publishedAt} />
                      </div>
                      <Link href={`/article/${story.id}`}>
                        <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                      {formatEditorialDate(story.publishedAt)}
                    </span>
                    <Link
                      href={`/article/${story.id}`}
                      className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                    >
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= CATEGORY 2: ANDHRA PRADESH ================= */}
        {apStories.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-amber-600 rounded-sm" />
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                    Andhra Pradesh Focus
                  </h2>
                  <p className="text-xs text-[#6F675C] dark:text-slate-400">
                    అమరావతి, ఉత్తరాంధ్ర, సీమ తాజా పరిణామాలు మరియు సంక్షేమం
                  </p>
                </div>
              </div>
              <Link
                href="/news/andhra_pradesh"
                className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View All AP News <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {apStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                      <img
                        src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                        <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                          {story.region || 'Andhra Pradesh'}
                        </span>
                        <TimeAgo timestamp={story.publishedAt} />
                      </div>
                      <Link href={`/article/${story.id}`}>
                        <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                      {formatEditorialDate(story.publishedAt)}
                    </span>
                    <Link
                      href={`/article/${story.id}`}
                      className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                    >
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= CATEGORY 3: POLITICS & POLICY (PHASE 2 LOCKED) ================= */}
        <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-6 bg-red-600 rounded-sm" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                    Politics & Governance
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Lock size={10} /> Phase 2 Module
                  </span>
                </div>
                <p className="text-xs text-[#6F675C] dark:text-slate-400">
                  పార్టీలు, రాజకీయ వ్యూహాలు మరియు విధాన నిర్ణయాలు · Enterprise Politics & Policy Intelligence
                </p>
              </div>
            </div>
            <Link
              href="/news/politics"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Preview Module <ChevronRight size={14} />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-dashed border-amber-500/30 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-red-500/[0.04] p-8 text-center">
            <div className="mx-auto max-w-xl flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-3 shadow-inner">
                <Lock size={22} className="animate-pulse" />
              </div>
              <h3 className="font-serif font-black text-lg md:text-xl text-[#211D18] dark:text-white">
                Politics & Election Intelligence Desk
              </h3>
              <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-2 max-w-md leading-relaxed">
                Live assembly tracking, election constituency heatmaps, party manifesto archives, and verified political op-eds are part of the Phase 2 Enterprise feature package.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">
                  Assembly Live Ticker
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">
                  Constituency Heatmaps
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">
                  Candidate Portfolios
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">
                  Op-Ed Verification Desk
                </span>
              </div>
              <Link
                href="/news/politics"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#211D18] dark:bg-white text-white dark:text-[#211D18] text-xs font-bold hover:opacity-90 transition shadow-sm"
              >
                <Sparkles size={13} />
                Explore Phase 2 Preview & Roadmap
              </Link>
            </div>
          </div>
        </section>

        {/* ================= SHOW ALL NEWS CONTINUOUS STREAM ================= */}
        <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-6 bg-[#1C3D5A] dark:bg-sky-500 rounded-sm" />
              <div>
                <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                  Show All News (తాజా వార్తల సమాహారం)
                </h2>
                <p className="text-xs text-[#6F675C] dark:text-slate-400">
                  సమగ్ర ప్రాంతీయ, రాష్ట్ర మరియు జాతీయ నిరంతర వార్తా ప్రవాహం
                </p>
              </div>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition shrink-0"
            >
              <Lock size={13} className="text-amber-300" />
              <span>Browse All 500 Stories Archive</span>
              <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-black">PHASE 2</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {continuousAllNews.map((story) => (
              <article
                key={story.id}
                className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                    <img
                      src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                      <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                        {story.region || story.category || 'News'}
                      </span>
                      <TimeAgo timestamp={story.publishedAt} />
                    </div>
                    <Link href={`/article/${story.id}`}>
                      <h3 className="font-serif font-bold text-base text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                    {formatEditorialDate(story.publishedAt)}
                  </span>
                  <Link
                    href={`/article/${story.id}`}
                    className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                  >
                    Read More <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= DK SHORTS SECTION (ONLY DISPLAYED IF SHORTS EXIST) ================= */}
        {shorts && shorts.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-red-600 text-white p-2 rounded-lg shadow-sm">
                  <Play size={16} className="fill-current" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-xl text-[#211D18] dark:text-white">DK Shorts</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F675C] dark:text-slate-400">
                    Quick Vertical Video Bulletins
                  </p>
                </div>
              </div>
              <Link
                href="/shorts"
                className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {shorts.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm group cursor-pointer hover:border-red-500 transition"
                >
                  <div className="aspect-[9/16] bg-slate-900 relative">
                    {s.thumbnailUrl && (
                      <img
                        src={s.thumbnailUrl}
                        alt={s.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-red-600 transition shadow-lg">
                        <Play size={16} className="text-white fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
                        {s.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= JOBS & MARKETPLACE SPLIT (PHASE 2 LOCKED) ================= */}
        <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JOBS BOARD - PHASE 2 */}
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-dashed border-amber-500/30 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-[#1C3D5A] dark:bg-sky-700 text-white p-2 rounded-lg">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <h2 className="font-serif font-black text-lg text-[#211D18] dark:text-white">Local Careers & Jobs</h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      <Lock size={10} /> Phase 2 Module · Preview Mode
                    </span>
                  </div>
                </div>
                <Link href="/jobs" className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-400 hover:underline">
                  View Preview →
                </Link>
              </div>

              <div className="py-6 px-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 text-center my-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-2.5">
                  <Briefcase size={18} />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-white">Enterprise Recruitment Portal</h3>
                <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Candidate screening, employer dashboard, instant WhatsApp applications, and resume parsing are scheduled for the Phase 2 rollout.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">Employer Dashboard</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">Resume Matcher</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">Direct WhatsApp Apply</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6F675C] dark:text-slate-400">Available with developer maintenance contract</span>
              <Link href="/jobs" className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1">
                Preview Interface <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* MARKETPLACE CLASSIFIEDS - PHASE 2 */}
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-dashed border-amber-500/30 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-amber-600 text-white p-2 rounded-lg">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <h2 className="font-serif font-black text-lg text-[#211D18] dark:text-white">Marketplace & Classifieds</h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      <Lock size={10} /> Phase 2 Module · Preview Mode
                    </span>
                  </div>
                </div>
                <Link href="/marketplace" className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-400 hover:underline">
                  View Preview →
                </Link>
              </div>

              <div className="py-6 px-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 text-center my-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-2.5">
                  <ShoppingBag size={18} />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-white">Peer-to-Peer Classifieds & Real Estate</h3>
                <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Verified seller badges, escrow payments, real estate 360 tours, and multi-district listings unlock in Phase 2.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">Verified Seller KYC</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">Real Estate Grid</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-medium">Auto WhatsApp Leads</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6F675C] dark:text-slate-400">Available with developer maintenance contract</span>
              <Link href="/marketplace" className="font-bold text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                Preview Interface <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= SPONSORED & PROMOTIONS AD SLOT (PREVIEW) ================= */}
        <section className="pt-6">
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border-2 border-dashed border-amber-500/35 dark:border-amber-400/25 p-6 md:p-8 shadow-sm relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.04] dark:bg-amber-400/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                {/* Eyebrow Pill */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Sparkles size={11} /> Sponsored Ad Placement Slot
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400">
                    Leaderboard · 1400 × 200 Display
                  </span>
                </div>

                {/* Main Headline */}
                <h3 className="font-serif font-black text-xl md:text-2xl text-[#211D18] dark:text-white leading-tight">
                  You Can Place Promotions &amp; Sponsored Partner Ads Here
                </h3>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5 mb-2">
                  (మీ వ్యాపార ప్రకటనలు, ప్రమోషన్లు మరియు బ్రాండ్ ప్రచారాలను ఇక్కడ సులభంగా ప్రదర్శించవచ్చు)
                </p>

                {/* Description */}
                <p className="text-xs md:text-sm text-[#6F675C] dark:text-slate-300 leading-relaxed">
                  Engage hundreds of thousands of verified readers across Telangana and Andhra Pradesh. Dynamically configure promotional banners, real estate projects, business launches, or programmatic ad networks directly through your editorial dashboard.
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F5F1E8] dark:bg-white/5 text-[#211D18] dark:text-slate-200 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                    ✓ Custom Click-Through Link
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F5F1E8] dark:bg-white/5 text-[#211D18] dark:text-slate-200 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                    ✓ Telangana &amp; AP Regional Targeting
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F5F1E8] dark:bg-white/5 text-[#211D18] dark:text-slate-200 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                    ✓ Direct WhatsApp Lead Generation
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F5F1E8] dark:bg-white/5 text-[#211D18] dark:text-slate-200 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                    ✓ Google AdSense &amp; Banner Ready
                  </span>
                </div>
              </div>

              {/* Action Side */}
              <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                <a
                  href="mailto:ads@dktimesnews.com?subject=Advertising%20Inquiry%20-%20DK%20Times"
                  className="bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-sm transition text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Megaphone size={14} /> Promote Your Brand Here →
                </a>
                <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-semibold text-center">
                  Daily · Weekly · Monthly Packages
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
