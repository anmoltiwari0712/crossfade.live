import { Check, Minus } from 'lucide-react';
import { COMPARISON_ROWS } from '../data/content';

export default function DifferenceTable() {
  return (
    <section id="difference" className="py-16 md:py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#ffd2d7] mb-2.5">
            The numbers Google should be embarrassed about
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Experience the difference
          </h2>
          <p className="text-[#b3b3b3] text-base md:text-lg max-w-xl mx-auto">
            A trillion-dollar company. A billion songs. Yet two tracks still never get to meet.
          </p>
        </div>

        <div className="w-full" role="table" aria-label="Youutube Music default vs CrossFade v2.0">
          <div
            className="grid grid-cols-[1.45fr_0.75fr_0.75fr] items-end border-b border-white pb-4 text-sm font-bold"
            role="row"
          >
            <div className="px-3 text-left text-white" role="columnheader">
              What you get
            </div>
            <div className="px-2 text-center text-[#b3b3b3]" role="columnheader">
              Youutube Music
              <span className="block text-[11px] font-normal">Default</span>
            </div>
            <div
              className="px-2 py-2.5 -mb-4 rounded-t-xl bg-white/[0.08] text-center text-[#ffd2d7]"
              role="columnheader"
            >
              CrossFade
              <span className="block text-[11px] font-normal text-white/80">v2.0</span>
            </div>
          </div>

          {COMPARISON_ROWS.map((label, idx) => (
            <div
              key={label}
              role="row"
              className={`grid grid-cols-[1.45fr_0.75fr_0.75fr] items-center border-b border-white/15 hover:bg-white/[0.03] transition-colors ${
                idx === COMPARISON_ROWS.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="py-4 px-3 text-sm md:text-base font-medium text-white" role="cell">
                {label}
              </div>
              <div className="py-4 px-2 flex justify-center" role="cell">
                <Minus size={18} className="text-[#727272]" aria-label="Not included" />
              </div>
              <div
                className={`py-4 px-2 flex justify-center bg-white/[0.08] ${
                  idx === COMPARISON_ROWS.length - 1 ? 'rounded-b-xl' : ''
                }`}
                role="cell"
              >
                <span
                  className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center"
                  aria-label="Included"
                >
                  <Check size={14} strokeWidth={3} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
