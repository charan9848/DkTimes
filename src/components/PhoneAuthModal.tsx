'use client';

import { X, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneAuthModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#FFFDF7] dark:bg-[#141414] rounded-3xl border border-[rgba(33,29,24,0.12)] dark:border-white/10 shadow-2xl p-6 sm:p-8 text-center overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#6F675C] dark:text-slate-400 hover:text-[#211D18] dark:hover:text-white rounded-full transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Branded Logo with Lock Indicator */}
        <div className="relative mx-auto w-20 h-20 mb-4">
          <img
            src="/logo.png"
            alt="DK Times Official Logo"
            className="w-20 h-20 rounded-2xl shadow-md border-2 border-amber-500/30 object-cover"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-[#FFFDF7] dark:border-[#141414]">
            <Lock size={16} className="animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">
          <Sparkles size={11} /> Phase 2 Module · Preview Only
        </div>

        <h2 className="font-serif font-black text-xl text-[#211D18] dark:text-white mb-2">
          Reader Account Module Locked
        </h2>

        <p className="text-xs text-[#6F675C] dark:text-slate-300 leading-relaxed max-w-sm mx-auto mb-6">
          Phone OTP authentication, reader membership, and personalized user profile management are part of the Phase 2 Enterprise Release.
        </p>

        <div className="space-y-2">
          <Link
            href="/account"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#1C3D5A] hover:bg-[#142A3E] text-white font-bold text-xs py-3 rounded-xl transition"
          >
            <Lock size={13} className="text-amber-300" /> View Account Lock Details
          </Link>
          <button
            onClick={onClose}
            className="w-full text-xs font-semibold text-[#6F675C] dark:text-slate-400 hover:text-[#211D18] dark:hover:text-white py-2 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
