import { Check } from 'lucide-react';
import { PRESET_CARDS } from '../data/content';

const THEME_STYLES = {
  pink: {
    badge: 'bg-[#ffd2d7] text-black',
    title: 'text-[#ffd2d7]',
    cta: 'bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black',
    ring: 'border-[#ffd2d7]/20 hover:border-[#ffd2d7]/55',
  },
  lavender: {
    badge: 'bg-[#c4b1d4] text-black',
    title: 'text-[#c4b1d4]',
    cta: 'bg-[#c4b1d4] hover:bg-[#d8c9e5] text-black',
    ring: 'border-[#c4b1d4]/30 hover:border-[#c4b1d4]/70',
  },
  gold: {
    badge: 'bg-[#ffc862] text-black',
    title: 'text-[#ffc862]',
    cta: 'bg-[#ffc862] hover:bg-[#ffd688] text-black',
    ring: 'border-[#ffc862]/20 hover:border-[#ffc862]/55',
  },
};

export default function PresetCards({ onSelectPreset }) {
  return (
    <section id="presets" className="py-16 md:py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#c4b1d4] mb-2.5">
            You’re the DJ now
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Not every playlist needs the same therapy.
          </h2>
          <p className="text-[#b3b3b3] text-base md:text-lg max-w-2xl mx-auto">
            Your gym playlist and your midnight lo-fi playlist probably shouldn’t have identical transitions. Your music. Your rules. Your questionable playlist choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRESET_CARDS.map((card) => {
            const st = THEME_STYLES[card.theme];
            return (
              <article
                key={card.id}
                className={`bg-[#242424] border ${st.ring} rounded-2xl p-6 flex flex-col transition-colors`}
              >
                <span className={`inline-block w-fit text-xs font-extrabold px-2.5 py-1 rounded ${st.badge} mb-4`}>
                  {card.badge}
                </span>

                <h3 className={`text-2xl font-extrabold ${st.title} mb-1`}>{card.title}</h3>
                <p className="text-lg font-bold text-white">
                  {card.price}{' '}
                  <span className="text-sm font-normal text-[#b3b3b3]">/ {card.subtitle}</span>
                </p>

                <hr className="border-white/15 my-5" />

                <ul className="space-y-3 mb-7 text-sm text-[#e5e5e5] flex-1">
                  {card.bullets.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-white" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                {card.href ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-3.5 px-5 rounded-full font-bold text-sm transition-transform hover:scale-[1.02] ${st.cta}`}
                  >
                    {card.ctaLabel}
                  </a>
                ) : (
                  <a
                    href="#experience"
                    onClick={() => onSelectPreset(card.demoSeconds, card.demoCurve)}
                    className={`w-full text-center py-3.5 px-5 rounded-full font-bold text-sm transition-transform hover:scale-[1.02] ${st.cta}`}
                  >
                    {card.ctaLabel}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

