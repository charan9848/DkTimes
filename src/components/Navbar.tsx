'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Lock } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
  isLocked?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'All News', href: '/news' },
  { label: 'Telangana', href: '/news/telangana' },
  { label: 'Andhra Pradesh', href: '/news/andhra_pradesh' },
  { label: 'Politics', href: '/news/politics', isLocked: true },
  { label: 'Technology', href: '/news/technology', isLocked: true },
  { label: 'Entertainment', href: '/news/entertainment', isLocked: true },
  { label: 'Sports', href: '/news/sports', isLocked: true },
  { label: 'Jobs', href: '/jobs', isLocked: true },
  { label: 'Marketplace', href: '/marketplace', isLocked: true },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#FFFDF7] dark:bg-[#121212] border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 flex items-center gap-1 py-0 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 md:px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] transition shrink-0 flex items-center gap-1.5 ${
                item.isSpecial
                  ? 'text-red-600 hover:text-red-700 font-extrabold'
                  : isActive
                  ? 'text-[#1C3D5A] dark:text-sky-400 border-b-2 border-[#1C3D5A] dark:border-sky-400'
                  : 'text-[#6F675C] dark:text-slate-400 hover:text-[#211D18] dark:hover:text-white'
              }`}
            >
              {item.isSpecial && <Play size={12} className="fill-current text-red-600" />}
              <span>{item.label}</span>
              {item.isLocked && (
                <span className="flex items-center gap-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal ml-0.5">
                  <Lock size={9} />
                  <span>PREVIEW</span>
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
