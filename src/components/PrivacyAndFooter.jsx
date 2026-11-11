import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LINKS, PRIVACY_FAQS } from '../data/content';

export default function PrivacyAndFooter() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
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

      {/* Final CTA + Developer */}
      <section
        id="developer"
        className="py-16 md:py-20 px-5"
        style={{
          background: 'linear-gradient(180deg, #121212 0%, #241926 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="bg-[#181818] border border-[#ffd2d7]/30 rounded-2xl p-8 flex flex-col">
            <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#ffd2d7] mb-2">
              One last thing, YouTube Music
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              You had one job. We did it for you.
            </h2>
            <p className="text-[#b3b3b3] text-sm md:text-base mb-4">
              Your songs deserve better than awkward silence. Your playlists deserve better than abrupt endings. Install CrossFade and give your music the transitions it deserves.
            </p>
            <div className="mt-auto pt-4">
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

          <div className="bg-[#181818] border border-white/10 rounded-2xl p-8 flex flex-col">
            <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#c4b1d4] mb-2">
              The person who couldn’t let it go
            </p>
            <h3 className="text-2xl font-extrabold mb-3">
              Built by Anmol. Powered by playlists and mild frustration.
            </h3>
            <p className="text-[#b3b3b3] text-sm md:text-base mb-3">
              I’m a software engineer who occasionally gets annoyed by tiny things and decides to build an entire product around fixing them. Why are two songs still not allowed to overlap?
            </p>
            <p className="text-[#b3b3b3] text-sm md:text-base mb-6">
              If you like what I’ve built, say hello. If something breaks, definitely say hello.
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              <a
                href={LINKS.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-white/35 hover:border-white text-white font-bold text-sm transition-transform hover:scale-105"
              >
                My GitHub
              </a>
              <a
                href={LINKS.email}
                className="px-6 py-3 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black font-bold text-sm transition-transform hover:scale-105"
              >
                Send Me an Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Spotify-style Black Multi-column Footer */}
      <footer className="bg-black border-t border-white/10 pt-14 pb-10 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/15">
            <div>
              <a href="#top" className="flex items-center gap-2.5 mb-3">
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
              <a href="#experience" className="text-white hover:text-[#1ed760]">Live Audio Demo</a>
              <a href="#presets" className="text-white hover:text-[#1ed760]">Fade Presets</a>
              <a href="#difference" className="text-white hover:text-[#1ed760]">Difference Table</a>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#b3b3b3] mb-1">Developer</h4>
              <a href={LINKS.githubProfile} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1ed760]">GitHub (@anmoltiwari0712)</a>
              <a href={LINKS.githubRepo} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1ed760]">Source Code</a>
              <a href={LINKS.email} className="text-white hover:text-[#1ed760]">Contact Anmol</a>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#b3b3b3] mb-1">Trust</h4>
              <a href="#privacy" className="text-white hover:text-[#1ed760]">Privacy Promise</a>
              <a href="#audience" className="text-white hover:text-[#1ed760]">Audience Feedback</a>
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
