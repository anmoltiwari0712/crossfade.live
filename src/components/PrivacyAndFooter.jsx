import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LINKS, PRIVACY_FAQS } from '../data/content';

export default function PrivacyAndFooter({ onOpenSource, onNavigateHome, showBody = true }) {
  const [openIdx, setOpenIdx] = useState(0);

  const handleSectionClick = (hash) => (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome(hash);
    }
  };

  const handleSourceClick = (e) => {
    if (onOpenSource) {
      e.preventDefault();
      onOpenSource();
    }
  };

  return (
    <>
      {showBody && (
        <>
          {/* Spotify-style FAQ / Privacy */}
          <section id="privacy" className="py-16 md:py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#ffd2d7] mb-2.5">
              We’re here for your music, not your data
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Your listening history isn’t our business.
            </h2>
            <p className="text-[#b3b3b3] text-base">
              We don’t need to know that you’ve played the same breakup song 47 times this week. We’re not judging. We’re just not collecting it.
            </p>
          </div>

          <div className="border-t border-white/15">
            {PRIVACY_FAQS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q} className="border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="w-full py-5 px-2 flex items-center justify-between text-left gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg font-bold text-white">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#b3b3b3] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#ffd2d7]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-2 pb-5 text-sm md:text-base text-[#b3b3b3] leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16 md:py-20 px-5"
        style={{
          background: 'linear-gradient(180deg, #121212 0%, #241926 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#181818] border border-[#ffd2d7]/30 rounded-2xl p-8 md:p-10 flex flex-col items-center text-center">
            <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#ffd2d7] mb-2">
              One last thing, Youutube Music
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              You had one job. We did it for you.
            </h2>
            <p className="text-[#b3b3b3] text-sm md:text-base max-w-xl mb-6">
              Spotify figured this out years ago—meanwhile Youutube Music still leaves you staring into the void between songs.
            </p>
            <div>
              <a
                href={LINKS.cws}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 py-3.5 rounded-full bg-[#1ed760] hover:bg-[#3be477] text-black font-bold text-sm transition-transform hover:scale-105"
              >
                Add to Chrome — It’s About Time
              </a>
              <p className="text-xs text-[#b3b3b3] mt-3">
                Free. Lightweight. No nonsense. Just better transitions.
              </p>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Spotify-style Black Multi-column Footer */}
      <footer className="bg-black border-t border-white/10 pt-14 pb-10 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/15">
            <div>
              <a href="#top" onClick={handleSectionClick('#top')} className="flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center">
                  <img src="./icon128.png" alt="" className="w-full h-full rounded-full" />
                </span>
                <span className="text-lg font-extrabold text-white">CrossFade</span>
              </a>
              <p className="text-xs text-[#b3b3b3]">
                Made independently, because apparently someone had to.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#b3b3b3] mb-1">Product</h4>
              <a href={LINKS.cws} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1ed760]">Chrome Web Store</a>
              <a href="#experience" onClick={handleSectionClick('#experience')} className="text-white hover:text-[#1ed760]">Live Audio Demo</a>
              <a href="#presets" onClick={handleSectionClick('#presets')} className="text-white hover:text-[#1ed760]">Fade Presets</a>
              <a href="#difference" onClick={handleSectionClick('#difference')} className="text-white hover:text-[#1ed760]">Difference Table</a>
            </div>

            <div id="developer" className="flex flex-col gap-2.5 text-sm">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#b3b3b3] mb-1">Developer</h4>
              <a href={LINKS.portfolio} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1ed760]">Portfolio (bilkulanmol.vercel.app)</a>
              <a href={LINKS.githubProfile} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1ed760]">GitHub (@anmoltiwari0712)</a>
              <a href="#/source" onClick={handleSourceClick} className="text-white hover:text-[#1ed760]">Source Code</a>
              <a href={LINKS.email} className="text-white hover:text-[#1ed760]">Contact Anmol</a>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#b3b3b3] mb-1">Trust</h4>
              <a href="#privacy" onClick={handleSectionClick('#privacy')} className="text-white hover:text-[#1ed760]">Privacy Promise</a>
              <a href="#audience" onClick={handleSectionClick('#audience')} className="text-white hover:text-[#1ed760]">Audience Feedback</a>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#727272]">
            <p>CrossFade v2.0 · Built for listeners who hate dead air.</p>
            <p>
              CrossFade is an independent browser extension and is not affiliated with, endorsed by, or sponsored by Spotify, YouTube, or Google.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
