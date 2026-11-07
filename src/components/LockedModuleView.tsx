'use client';

import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';

interface Props {
  title: string;
  categoryName?: string;
  description?: string;
}

export default function LockedModuleView({
  title,
  categoryName = 'Category',
  description = 'This section is part of the Phase 2 Enterprise Rollout for DK Times.',
}: Props) {
  return (
    <div className="mx-auto max-w-[900px] px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
      <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-3xl border border-[rgba(33,29,24,0.12)] dark:border-white/10 p-5 sm:p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Official Brand Emblem with Lock Indicator */}
        <div className="relative mx-auto w-24 h-24 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-700/60 p-2 shadow-md flex items-center justify-center mb-6">
          <img src="/logo.png" alt="DK Times Official Crest" className="w-full h-full object-contain rounded-xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#141414]">
            <Lock size={16} />
          </div>
        </div>

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-[0.16em] mb-4">
          <Sparkles size={12} /> Phase 2 Module · Preview Only
        </div>

        {/* Headline */}
        <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#211D18] dark:text-white leading-tight">
          {title} Module Locked
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-[#6F675C] dark:text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
          {description} The Core Reader Portal (Home, Telangana, and Andhra Pradesh) is live. Full activation of this module requires the Phase 2 deployment agreement.
        </p>

        {/* Feature Preview Card */}
        <div className="mt-8 pt-6 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10 max-w-lg mx-auto text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400 mb-3 flex items-center gap-1.5">
            <ShieldCheck size={14} /> Features Included in Phase 2 Release:
          </h3>
          <ul className="space-y-2 text-xs text-[#6F675C] dark:text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Full real-time synchronization with mobile app backend
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Dedicated sub-category archives and chronological feeds
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Interactive WhatsApp sharing, comments, and likes integration
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition"
          >
            <ArrowLeft size={14} /> Back to Live News Feed
          </Link>

          <span className="text-[11px] font-semibold text-[#6F675C] dark:text-slate-400 flex items-center gap-1">
            <PhoneCall size={12} className="text-amber-600" /> Contact Developer to Unlock
          </span>
        </div>
      </div>
    </div>
  );
}
