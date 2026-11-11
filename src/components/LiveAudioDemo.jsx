import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { buildCurvePaths, createSynthController } from '../lib/audioDemo';

const GAP_STEPS = [
  'Song A ends.',
  'Silence.',
  'You question your internet connection.',
  'Song B finally starts.',
];

export default function LiveAudioDemo({ duration, setDuration, curve, setCurve }) {
  const synthRef = useRef(null);
  const stopRef = useRef(null);

  const [modePlaying, setModePlaying] = useState(null); // 'gap' | 'mix' | null
  const [gapStep, setGapStep] = useState(0);
  const [mixState, setMixState] = useState({ p: 0, a: 1, b: 0 });

  useEffect(() => {
    synthRef.current = createSynthController();
    return () => {
      stopRef.current?.();
    };
  }, []);

  const paths = useMemo(() => buildCurvePaths(curve, 360, 100, 10), [curve]);

  function stopPlayback() {
    stopRef.current?.();
    stopRef.current = null;
    setModePlaying(null);
    setGapStep(0);
    setMixState({ p: 0, a: 1, b: 0 });
  }

  function handleGapDemo() {
    if (modePlaying === 'gap') {
      stopPlayback();
      return;
    }
    stopPlayback();
    setModePlaying('gap');
    stopRef.current = synthRef.current.playGapDemo({
      onStep: (step) => setGapStep(step),
      onComplete: () => {
        setModePlaying(null);
        setGapStep(0);
      },
    });
  }

  function handleMixDemo() {
    if (modePlaying === 'mix') {
      stopPlayback();
      return;
    }
    stopPlayback();
    setModePlaying('mix');
    stopRef.current = synthRef.current.playCrossfade({
      durationSec: duration,
      curve,
      onFrame: (frame) => setMixState(frame),
      onComplete: () => {
        setModePlaying(null);
        setMixState({ p: 0, a: 1, b: 0 });
      },
    });
  }

  const playheadX = (mixState.p * 360).toFixed(1);

  return (
    <section id="experience" className="py-16 md:py-20 px-5 bg-[#0b0b0b] border-y border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#ffd2d7] mb-2.5">
            Live audio demo
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Don’t just read about it. Hear what YouTube Music has been missing.
          </h2>
          <p className="text-[#b3b3b3] text-base md:text-lg max-w-2xl mx-auto">
            Two audio decks. One smooth transition. No awkward introductions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
          {/* Left: Without CrossFade */}
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 md:p-7 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-[#b3b3b3]">
                Without CrossFade
              </span>
              {modePlaying === 'gap' && (
                <span className="font-mono text-xs text-[#f15e6c]">Playing gap…</span>
              )}
            </div>

            <h3 className="text-xl font-extrabold mb-5">
              On the left: how songs normally say goodbye.
            </h3>

            <ol className="space-y-2.5 mb-5">
              {GAP_STEPS.map((label, idx) => {
                const stepNum = idx + 1;
                const active = modePlaying === 'gap' && gapStep === stepNum;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-sm ${
                      active
                        ? 'bg-[#f15e6c]/15 border-[#f15e6c]/60 text-white'
                        : 'bg-[#121212] border-white/5 text-[#d4d4d4]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                        active ? 'bg-[#f15e6c] text-black' : 'bg-white/10 text-[#b3b3b3]'
                      }`}
                    >
                      {stepNum}
                    </span>
                    <span>{label}</span>
                  </li>
                );
              })}
            </ol>

            <p className="text-sm italic text-[#b3b3b3] mb-6 mt-auto">
              Romantic, really. Two songs that never get to meet.
            </p>

            <button
              type="button"
              onClick={handleGapDemo}
              className="w-full py-3.5 px-5 rounded-full border border-white/35 hover:border-white hover:bg-white/5 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {modePlaying === 'gap' ? (
                <>
                  <Square size={14} fill="currentColor" /> Stop Awkward Gap
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> Hear the Awkward Gap
                </>
              )}
            </button>
          </div>

          {/* Right: With CrossFade Interactive Deck */}
          <div className="bg-gradient-to-b from-[#2b2028] via-[#1d181e] to-[#181818] border border-[#ffd2d7]/35 rounded-2xl p-6 md:p-7 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ffd2d7] text-black">
                With CrossFade v2.0
              </span>

              <div className="flex items-center gap-2 font-mono text-xs text-[#1ed760]">
                {modePlaying === 'mix' && (
                  <span className="flex items-end gap-0.5 h-3" aria-hidden="true">
                    <span className="w-0.5 h-full bg-[#1ed760] eq-bar-1" />
                    <span className="w-0.5 h-full bg-[#1ed760] eq-bar-2" />
                    <span className="w-0.5 h-full bg-[#1ed760] eq-bar-3" />
                  </span>
                )}
                <span>{modePlaying === 'mix' ? `Mixing (${duration}s)` : 'Ready'}</span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold mb-4">
              On the right: how songs should say goodbye.
            </h3>

            {/* Live Deck Level Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#ffd2d7]">Song A</span>
                  <span className="font-mono text-[#b3b3b3]">{Math.round(mixState.a * 100)}%</span>
                </div>
                <p className="text-xs text-[#d4d4d4] mb-2">Still singing its heart out.</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ffd2d7] transition-[width] duration-75"
                    style={{ width: `${Math.round(mixState.a * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#1ed760]">Song B</span>
                  <span className="font-mono text-[#b3b3b3]">{Math.round(mixState.b * 100)}%</span>
                </div>
                <p className="text-xs text-[#d4d4d4] mb-2">Already making its entrance.</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1ed760] transition-[width] duration-75"
                    style={{ width: `${Math.round(mixState.b * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Curve Plot */}
            <div className="bg-black/45 border border-white/10 rounded-xl p-3 mb-4">
              <svg viewBox="0 0 360 100" className="w-full h-24 block" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="reactGradA" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffd2d7" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#ffd2d7" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="reactGradB" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1ed760" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#1ed760" stopOpacity="0.26" />
                  </linearGradient>
                </defs>
                <path d={paths.areaA} fill="url(#reactGradA)" />
                <path d={paths.areaB} fill="url(#reactGradB)" />
                <path d={paths.lineA} fill="none" stroke="#ffd2d7" strokeWidth="2.6" strokeLinecap="round" />
                <path d={paths.lineB} fill="none" stroke="#1ed760" strokeWidth="2.6" strokeLinecap="round" />
                {modePlaying === 'mix' && (
                  <line
                    x1={playheadX}
                    y1="4"
                    x2={playheadX}
                    y2="96"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}
              </svg>
            </div>

            {/* Controls */}
            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between text-sm font-bold">
                <label htmlFor="demo-duration-range">Crossfade duration:</label>
                <span className="font-mono text-[#ffd2d7]">
                  {duration} {duration === 1 ? 'second' : 'seconds'}
                </span>
              </div>

              <input
                id="demo-duration-range"
                type="range"
                min={1}
                max={12}
                step={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-[#ffd2d7] cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurve('equalpower')}
                  className={`py-2 px-3 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    curve === 'equalpower'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-[#b3b3b3] border-white/25 hover:border-white/60'
                  }`}
                >
                  Equal Power
                </button>
                <button
                  type="button"
                  onClick={() => setCurve('linear')}
                  className={`py-2 px-3 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    curve === 'linear'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-[#b3b3b3] border-white/25 hover:border-white/60'
                  }`}
                >
                  Linear
                </button>
              </div>

              <button
                type="button"
                onClick={handleMixDemo}
                className="w-full py-3.5 px-5 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] cursor-pointer"
              >
                {modePlaying === 'mix' ? (
                  <>
                    <Square size={14} fill="currentColor" /> Stop Demo
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" /> Play the Demo
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#b3b3b3]">
                Locally synthesized audio demo. No actual songs were harmed in the making of this demonstration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
