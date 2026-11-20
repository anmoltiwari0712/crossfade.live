import { LINKS } from '../data/content';

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-24 md:pt-24 md:pb-28 text-center"
      style={{
        background:
          'linear-gradient(180deg, #ffd2d7 0%, #c4b1d4 30%, #2a1e2e 72%, #121212 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto px-5">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <p className="inline-block font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-black bg-white/55 px-4 py-1.5 rounded-full">
            An open letter to Youutube Music
          </p>
          <a
            href={LINKS.cws}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1ed760]/30 border border-[#1ed760]/70 text-black font-mono text-[11px] font-bold tracking-[0.06em] px-3.5 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ed760] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1ed760]"></span>
            </span>
            <span>200+ installs in last 7 days</span>
            <span className="text-black/40">·</span>
            <span>★★★★★ 5.0</span>
          </a>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.06] text-white drop-shadow-sm mb-5">
          Dear Youutube Music, it’s called crossfade. Google it.
        </h1>

        <p className="text-lg sm:text-xl font-medium text-white/95 max-w-2xl mx-auto mb-8 leading-relaxed">
          Actually, don’t. Just install this.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-7">
          <a
            href={LINKS.cws}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black font-bold text-base transition-transform hover:scale-105 shadow-lg shadow-black/20"
          >
            Fix My Youutube Music (Free)
          </a>
          <a
            href="#experience"
            className="px-8 py-4 rounded-full bg-black/50 hover:bg-black/75 border border-white/60 hover:border-white text-white font-bold text-base transition-transform hover:scale-105"
          >
            See how it works ↓
          </a>
        </div>

        <p className="text-xs text-[#e3d7e2] max-w-xl mx-auto">
          200+ active listeners · 1–12s custom overlap · 2 audio decks · 100% local audio processing · Free Chrome extension. Not affiliated with Google or Spotify.
        </p>
      </div>
    </section>
  );
}

