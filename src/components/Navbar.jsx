import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LINKS } from '../data/content';

export default function Navbar({ onNavigateHome, onOpenComingSoon }) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'Difference', href: '#difference' },
    { label: 'Live Demo', href: '#experience' },
    { label: 'Presets', href: '#presets' },
    { label: 'Report Bug', href: '#report' },
    { label: 'Privacy', href: '#privacy' },
  ];

  function handleLinkClick(href) {
    setOpen(false);
    onNavigateHome?.(href);
  }

  function handleComingSoonClick(e) {
    setOpen(false);
    if (onOpenComingSoon) {
      e.preventDefault();
      onOpenComingSoon();
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4" aria-label="Primary">
        <a
          href="#top"
          onClick={() => handleLinkClick('#top')}
          className="flex items-center gap-2.5 group justify-self-start"
        >
          <span className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="./icon128.png" alt="" className="w-full h-full rounded-full" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">CrossFade</span>
          <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ffd2d7]/15 text-[#ffd2d7]">
            v2.0
          </span>
        </a>

        {/* Centered Desktop links */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-7 text-sm font-bold whitespace-nowrap">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className="text-white hover:text-[#1ed760] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center justify-self-end gap-5 text-sm font-bold whitespace-nowrap">
          <a
            href={LINKS.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            Developer
          </a>
          <a
            href={LINKS.cws}
            onClick={handleComingSoonClick}
            className="px-5 py-2.5 rounded-full bg-[#1ed760] hover:bg-[#3be477] text-black font-bold transition-transform hover:scale-105"
          >
            Add to Chrome
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-white hover:text-[#ffd2d7]"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-5 py-5 flex flex-col gap-4 text-base font-bold">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className="text-white hover:text-[#1ed760]"
            >
              {item.label}
            </a>
          ))}
          <a
            href={LINKS.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="text-[#b3b3b3] hover:text-white"
          >
            Developer
          </a>
          <a
            href={LINKS.cws}
            onClick={handleComingSoonClick}
            className="mt-1 text-center px-5 py-3 rounded-full bg-[#1ed760] text-black font-bold"
          >
            Add to Chrome
          </a>
        </div>
      )}
    </header>
  );
}
