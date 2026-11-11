import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { moderateComment, SEED_COMMENTS, STORAGE_KEY } from '../lib/moderation';

const ACCENT_RING = {
  pink: 'bg-[#ffd2d7] text-black',
  lavender: 'bg-[#c4b1d4] text-black',
  gold: 'bg-[#ffc862] text-black',
  blue: 'bg-[#a5bbd1] text-black',
  green: 'bg-[#1ed760] text-black',
};

function loadInitialComments() {
  let saved = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        saved = parsed.filter(
          (item) => item && typeof item.text === 'string' && moderateComment(item.author, item.text).ok
        );
      }
    }
  } catch (_) {
    saved = [];
  }
  return [...saved, ...SEED_COMMENTS];
}

export default function AudienceSection() {
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [highlightId, setHighlightId] = useState(null);
  const [author, setAuthor] = useState('');
  const [vibe, setVibe] = useState('5s · Equal Power');
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    setComments(loadInitialComments());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ type: '', msg: '' });

    const res = moderateComment(author, text);
    if (!res.ok) {
      setFeedback({ type: 'error', msg: res.reason });
      return;
    }

    const newEntry = {
      id: `user-${Date.now()}`,
      author: res.author,
      vibe,
      accent: 'green',
      text: res.text,
      createdAt: 'Just now',
    };

    const userOnes = comments.filter((c) => !String(c.id).startsWith('seed-'));
    const nextUserOnes = [newEntry, ...userOnes].slice(0, 25);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUserOnes));
    } catch (_) {}

    setComments([...nextUserOnes, ...SEED_COMMENTS]);
    setHighlightId(newEntry.id);
    setText('');
    setFeedback({
      type: 'success',
      msg: '✓ Posted! Your feedback is now scrolling across the audience carousel.',
    });
  }

  const doubled = [...comments, ...comments];
  const durationSec = Math.max(24, comments.length * 6);

  return (
    <section id="audience" className="py-16 md:py-20 bg-[#0b0b0b] border-y border-white/10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#1ed760] mb-2.5">
            Don’t just take our word for it
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Hear from our audience
          </h2>
          <p className="text-[#b3b3b3] text-base md:text-lg max-w-2xl mx-auto">
            Did we fix your playlist or make things worse? We’re not a billion-dollar streaming company—we actually want to hear from listeners using this thing. (
            <strong className="text-white">{comments.length}</strong> notes on the wall)
          </p>
        </div>
      </div>

      {/* Auto Infinite-Scroll Carousel */}
      <div className="relative w-full overflow-hidden py-2 pb-10 marquee-wrapper" aria-label="Hear from our audience carousel">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 z-10 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 z-10 bg-gradient-to-l from-[#0b0b0b] to-transparent" />

        <div
          className="flex gap-4 w-max animate-marquee"
          style={{ '--marquee-duration': `${durationSec}s` }}
        >
          {doubled.map((item, idx) => {
            const initial = (item.author || 'A').replace(/^@/, '').trim().charAt(0).toUpperCase() || 'A';
            const badgeStyle = ACCENT_RING[item.accent] || ACCENT_RING.pink;
            const isHighlighted = item.id === highlightId;

            return (
              <article
                key={`${item.id}-${idx}`}
                className={`w-[290px] sm:w-[330px] shrink-0 bg-[#181818] hover:bg-[#222222] rounded-2xl p-5 flex flex-col justify-between gap-4 border transition-colors ${
                  isHighlighted ? 'border-[#1ed760]' : 'border-white/10'
                }`}
              >
                <p className="text-sm text-white leading-relaxed break-words">“{item.text}”</p>
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 ${badgeStyle}`}
                    >
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{item.author}</div>
                      <div className="font-mono text-[11px] text-[#b3b3b3]">{item.vibe}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-[#727272] shrink-0">
                    {item.createdAt}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Moderated Feedback Form */}
      <div className="max-w-3xl mx-auto px-5">
        <form onSubmit={handleSubmit} className="bg-[#181818] border border-white/15 rounded-2xl p-6 md:p-7" noValidate>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">Leave your two cents.</h3>
              <p className="text-sm text-[#b3b3b3]">
                Real feedback from real listeners. No corporate-approved happiness required.
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30"
              title="Abusive words, slurs, spam links, and XSS are automatically blocked"
            >
              <ShieldCheck size={14} /> Sanity Check Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="author-input" className="block text-xs font-bold text-white mb-1.5">
                Name or @handle
              </label>
              <input
                id="author-input"
                type="text"
                maxLength={32}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. @nightdrive_fm"
                className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label htmlFor="vibe-input" className="block text-xs font-bold text-white mb-1.5">
                Favorite crossfade duration / curve
              </label>
              <select
                id="vibe-input"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              >
                <option value="5s · Equal Power">5s · Equal Power</option>
                <option value="2s · Equal Power">2s · Equal Power</option>
                <option value="7s · Equal Power">7s · Equal Power</option>
                <option value="10s · Equal Power">10s · Equal Power</option>
                <option value="5s · Linear">5s · Linear</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="comment-input" className="text-xs font-bold text-white">
                Your comment <span className="text-[#ffd2d7]">*</span>
              </label>
              <span className="font-mono text-[11px] text-[#b3b3b3]">{text.length} / 240</span>
            </div>
            <textarea
              id="comment-input"
              rows={3}
              maxLength={240}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Wait until Song A's chorus melts right into Song B's intro..."
              className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none resize-y"
              required
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p
              className={`text-sm min-h-5 ${
                feedback.type === 'error'
                  ? 'text-[#f15e6c]'
                  : feedback.type === 'success'
                  ? 'text-[#1ed760]'
                  : 'text-[#b3b3b3]'
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback.msg}
            </p>
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
            >
              Post Your Feedback
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

