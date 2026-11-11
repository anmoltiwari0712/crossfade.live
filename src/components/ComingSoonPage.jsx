import { ArrowLeft, Clock, Play } from 'lucide-react';

export default function ComingSoonPage({ onBack, onTryDemo }) {
  return (
    <section
      className="min-h-[calc(100vh-160px)] flex items-center justify-center py-16 md:py-24 px-5"
      style={{
        background:
          'linear-gradient(180deg, #ffd2d7 0%, #c4b1d4 26%, #291e2c 62%, #121212 100%)',
      }}
    >
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-[#181818]/95 backdrop-blur-md border border-[#ffd2d7]/35 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.12em] uppercase bg-[#ffd2d7] text-black px-3.5 py-1.5 rounded-full mb-7">
            <Clock size={13} />
            Chrome Web Store · In Review
          </div>

          <div className="mx-auto w-20 h-20 rounded-2xl bg-white p-2.5 flex items-center justify-center mb-7 shadow-xl">
            <img src="./icon128.png" alt="CrossFade icon" className="w-full h-full rounded-xl" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Coming soon to Chrome Web Store.
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#1ed760] mb-5">
            v2.0.0 submitted · Waiting on store review approval
          </p>

          <p className="text-sm sm:text-base text-[#b3b3b3] max-w-lg mx-auto mb-8 leading-relaxed">
            CrossFade v2.0 has been packaged and submitted to the Chrome Web Store. Once Google approves the listing, every install button on this page will take you straight to the store page.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/40 hover:border-white text-white font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to CrossFade
            </button>

            <button
              type="button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1ed760] hover:bg-[#3be477] text-black font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <Play size={15} fill="currentColor" /> Hear Live Audio Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
