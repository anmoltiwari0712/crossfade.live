import { ArrowLeft, Sparkles } from 'lucide-react';
import { LINKS } from '../data/content';

export default function MagicSourcePage({ onBack }) {
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
            <Sparkles size={13} />
            The Magician’s Code · S07E24
          </div>

          <div className="mx-auto w-56 sm:w-64 aspect-square rounded-2xl overflow-hidden border-2 border-[#ffd2d7]/60 bg-black mb-7 shadow-xl">
            <img
              src="./barney-magic.gif"
              alt="Barney Stinson performing magic tricks, How I Met Your Mother"
              className="w-full h-full object-cover"
            />
          </div>

          <blockquote className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            “A magician never reveals his tricks.”
          </blockquote>

          <p className="font-mono text-xs sm:text-sm text-[#ffd2d7] mb-5">
            Barney Stinson · How I Met Your Mother (S07E24)
          </p>

          <p className="text-sm sm:text-base text-[#b3b3b3] max-w-lg mx-auto mb-8 leading-relaxed">
            Nice try, product managers. You already have a trillion dollars and an engineering army. Go figure out how two songs overlap on your own.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/40 hover:border-white text-white font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to CrossFade
            </button>

            <a
              href={LINKS.cws}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#1ed760] hover:bg-[#3be477] text-black font-bold text-sm transition-transform hover:scale-105"
            >
              Install the Magic Anyway
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

