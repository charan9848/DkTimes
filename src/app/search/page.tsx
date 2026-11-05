'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search as SearchIcon, 
  Calendar, 
  MapPin, 
  Tag, 
  ArrowUpDown, 
  X, 
  ArrowRight, 
  Loader2,
  Filter,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from '@/types';
import { formatTimeAgo, formatEditorialDate, parseDate } from '@/lib/date-utils';

const REGION_OPTIONS = [
  { label: 'All Regions', value: 'all' },
  { label: 'Telangana', value: 'telangana' },
  { label: 'Andhra Pradesh', value: 'andhra pradesh' },
  { label: 'Hyderabad', value: 'hyderabad' },
  { label: 'Amaravati', value: 'amaravati' },
  { label: 'Vijayawada', value: 'vijayawada' },
  { label: 'Visakhapatnam', value: 'visakhapatnam' },
  { label: 'Warangal', value: 'warangal' },
];

const DATE_OPTIONS = [
  { label: 'Any Time', value: 'all' },
  { label: 'Today (Past 24h)', value: 'today' },
  { label: 'Past 7 Days', value: 'week' },
  { label: 'Past 30 Days', value: 'month' },
];

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Politics', value: 'politics' },
  { label: 'Governance & Civic', value: 'governance' },
  { label: 'Crime & Police', value: 'crime' },
  { label: 'Business & Economy', value: 'business' },
  { label: 'Technology', value: 'technology' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Sports', value: 'sports' },
];

const POPULAR_TAGS = [
  'Telangana',
  'Andhra Pradesh',
  'Hyderabad',
  'Amaravati',
  'Politics',
  'Budget',
  'Assembly',
  'T-Hub',
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load published articles for search index
    const loadSearchIndex = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsArticle[];
        setArticles(data);
      } catch (err) {
        console.error('Error fetching search index:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSearchIndex();
  }, []);

  const hasActiveFilters = 
    searchTerm.trim() !== '' || 
    selectedRegion !== 'all' || 
    selectedDateRange !== 'all' || 
    selectedCategory !== 'all';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedRegion('all');
    setSelectedDateRange('all');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  const filteredArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const now = Date.now();

    return articles
      .filter((article) => {
        // 1. Text Search matching across title, summary, content, category, region
        if (term) {
          const matchTitle = (article.title || '').toLowerCase().includes(term);
          const matchSummary = (article.summary || '').toLowerCase().includes(term);
          const matchContent = (article.content || '').toLowerCase().includes(term);
          const matchCategory = (article.category || '').toLowerCase().includes(term);
          const matchRegion = (article.region || '').toLowerCase().includes(term);
          const matchAuthor = (article.author || '').toLowerCase().includes(term);
          if (!(matchTitle || matchSummary || matchContent || matchCategory || matchRegion || matchAuthor)) {
            return false;
          }
        }

        // 2. Location / Region Filter
        if (selectedRegion !== 'all') {
          const regTerm = selectedRegion.toLowerCase();
          const artRegion = (article.region || '').toLowerCase();
          const artRegions = (article.regions || []).map((r) => r.toLowerCase());
          const artTitle = (article.title || '').toLowerCase();
          const artSummary = (article.summary || '').toLowerCase();

          const matchesRegionField = artRegion.includes(regTerm) || artRegions.some((r) => r.includes(regTerm));
          const matchesTextContent = artTitle.includes(regTerm) || artSummary.includes(regTerm);

          if (!matchesRegionField && !matchesTextContent) {
            return false;
          }
        }

        // 3. Category Filter
        if (selectedCategory !== 'all') {
          const catTerm = selectedCategory.toLowerCase();
          const artCat = (article.category || '').toLowerCase();
          const artCats = (article.categories || []).map((c) => c.toLowerCase());
          const artTitle = (article.title || '').toLowerCase();

          const matchesCatField = artCat.includes(catTerm) || artCats.some((c) => c.includes(catTerm));
          const matchesTitle = artTitle.includes(catTerm);

          if (!matchesCatField && !matchesTitle) {
            return false;
          }
        }

        // 4. Date Range Filter
        if (selectedDateRange !== 'all') {
          const pubDate = parseDate(article.publishedAt);
          if (!pubDate) return false;
          const pubTime = pubDate.getTime();
          const diffMs = now - pubTime;

          if (selectedDateRange === 'today') {
            // Within 24 hours
            if (diffMs > 24 * 60 * 60 * 1000) return false;
          } else if (selectedDateRange === 'week') {
            // Within 7 days
            if (diffMs > 7 * 24 * 60 * 60 * 1000) return false;
          } else if (selectedDateRange === 'month') {
            // Within 30 days
            if (diffMs > 30 * 24 * 60 * 60 * 1000) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = parseDate(a.publishedAt)?.getTime() || 0;
        const dateB = parseDate(b.publishedAt)?.getTime() || 0;
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [articles, searchTerm, selectedRegion, selectedCategory, selectedDateRange, sortBy]);

  return (
    <main className="mx-auto max-w-[1100px] px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[11px] font-bold tracking-widest uppercase text-[#990000] dark:text-[#ff6b6b] mb-1.5 block">
          DK Times Archive & Search
        </span>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white mb-3">
          Search DK Times
        </h1>
        <p className="text-xs md:text-sm text-[#6F675C] dark:text-slate-400 leading-relaxed">
          Filter through live dispatches, state affairs, regional reporting, and policy updates across Telangana & Andhra Pradesh.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="relative max-w-3xl mx-auto mb-4">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F675C] dark:text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by keyword, leader, scheme, district, or beat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#FFFDF7] dark:bg-[#141414] border-2 border-[rgba(33,29,24,0.18)] dark:border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm md:text-base font-medium text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 shadow-sm placeholder:text-[#6F675C]/60 dark:placeholder:text-slate-500 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            aria-label="Clear search input"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F675C] hover:text-[#211D18] dark:hover:text-white p-1 rounded-full transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Popular Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mr-1.5">
          Quick:
        </span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchTerm(tag)}
            className="bg-[#FFFDF7] dark:bg-[#141414] border border-[rgba(33,29,24,0.12)] dark:border-white/10 hover:border-[#1C3D5A] dark:hover:border-sky-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#1C3D5A] dark:text-sky-300 transition"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.14)] dark:border-white/10 p-3 sm:p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[rgba(33,29,24,0.08)] dark:border-white/10">
          <Filter size={15} className="text-[#1C3D5A] dark:text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#211D18] dark:text-white">
            Filter & Refine
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="ml-auto flex items-center gap-1 text-[11px] font-bold text-[#990000] dark:text-rose-400 hover:underline"
            >
              <RotateCcw size={12} />
              Reset All
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Location Filter */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mb-1">
              <MapPin size={11} className="text-[#1C3D5A] dark:text-sky-400" />
              Location
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#F5F2EB] dark:bg-[#1f1f1f] border border-[rgba(33,29,24,0.15)] dark:border-white/10 text-xs font-semibold text-[#211D18] dark:text-white rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#1C3D5A] dark:focus:ring-sky-400 cursor-pointer"
            >
              {REGION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mb-1">
              <Calendar size={11} className="text-[#1C3D5A] dark:text-sky-400" />
              Date Published
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full bg-[#F5F2EB] dark:bg-[#1f1f1f] border border-[rgba(33,29,24,0.15)] dark:border-white/10 text-xs font-semibold text-[#211D18] dark:text-white rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#1C3D5A] dark:focus:ring-sky-400 cursor-pointer"
            >
              {DATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mb-1">
              <Tag size={11} className="text-[#1C3D5A] dark:text-sky-400" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#F5F2EB] dark:bg-[#1f1f1f] border border-[rgba(33,29,24,0.15)] dark:border-white/10 text-xs font-semibold text-[#211D18] dark:text-white rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#1C3D5A] dark:focus:ring-sky-400 cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mb-1">
              <ArrowUpDown size={11} className="text-[#1C3D5A] dark:text-sky-400" />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full bg-[#F5F2EB] dark:bg-[#1f1f1f] border border-[rgba(33,29,24,0.15)] dark:border-white/10 text-xs font-semibold text-[#211D18] dark:text-white rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#1C3D5A] dark:focus:ring-sky-400 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mr-1">
              Active:
            </span>
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1 bg-[#1C3D5A]/10 dark:bg-sky-500/20 text-[#1C3D5A] dark:text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Query: &ldquo;{searchTerm}&rdquo;
                <button onClick={() => setSearchTerm('')} aria-label="Remove search term filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedRegion !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#1C3D5A]/10 dark:bg-sky-500/20 text-[#1C3D5A] dark:text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
                Region: {selectedRegion}
                <button onClick={() => setSelectedRegion('all')} aria-label="Remove region filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedDateRange !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#1C3D5A]/10 dark:bg-sky-500/20 text-[#1C3D5A] dark:text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Date: {DATE_OPTIONS.find((d) => d.value === selectedDateRange)?.label}
                <button onClick={() => setSelectedDateRange('all')} aria-label="Remove date filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#1C3D5A]/10 dark:bg-sky-500/20 text-[#1C3D5A] dark:text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 size={32} className="animate-spin text-[#1C3D5A] dark:text-sky-400 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400">
            Indexing DK Times Dispatch Database...
          </p>
        </div>
      ) : (
        <div>
          {/* Result count & broadsheet header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#211D18] dark:border-white/20">
            <span className="font-serif font-black text-sm md:text-base text-[#211D18] dark:text-white uppercase tracking-wider">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'Dispatch Found' : 'Dispatches Found'}
            </span>
            <span className="text-[11px] text-[#6F675C] dark:text-slate-400 font-medium">
              Sorted by {sortBy === 'newest' ? 'Newest' : 'Oldest'}
            </span>
          </div>

          {/* Article Results Feed */}
          {filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.12)] dark:border-white/10 p-4 sm:p-5 shadow-sm hover:border-[#1C3D5A]/50 dark:hover:border-sky-400/50 transition flex flex-col sm:flex-row gap-4"
                >
                  {story.imageUrl && (
                    <div className="w-full sm:w-44 md:w-48 h-40 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                        <span className="font-bold uppercase tracking-wider text-[#990000] dark:text-[#ff6b6b] bg-[#990000]/10 dark:bg-[#ff6b6b]/10 px-2 py-0.5 rounded">
                          {story.region || 'Regional'}
                        </span>
                        {story.category && (
                          <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400 bg-[#1C3D5A]/10 dark:bg-sky-400/10 px-2 py-0.5 rounded">
                            {story.category}
                          </span>
                        )}
                        <span className="ml-auto">{formatTimeAgo(story.publishedAt)}</span>
                      </div>

                      <Link href={`/article/${story.id}`}>
                        <h2 className="font-serif font-bold text-base md:text-lg text-[#211D18] dark:text-slate-100 hover:text-[#1C3D5A] dark:hover:text-sky-400 transition leading-snug line-clamp-2">
                          {story.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary || (story.content ? story.content.slice(0, 160) + '...' : '')}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#6F675C] dark:text-slate-400">
                        {formatEditorialDate(story.publishedAt)}
                      </span>
                      <Link
                        href={`/article/${story.id}`}
                        className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1 group"
                      >
                        Read Dispatch
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.12)] dark:border-white/10 p-12 text-center max-w-xl mx-auto my-8">
              <SearchIcon size={36} className="text-[#6F675C]/50 dark:text-slate-500 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#211D18] dark:text-white mb-1">
                No matching dispatches found
              </h3>
              <p className="text-xs text-[#6F675C] dark:text-slate-400 mb-5 leading-relaxed">
                We couldn&apos;t find any stories matching your current query or combination of filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#1C3D5A] hover:bg-[#152e44] text-white text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
