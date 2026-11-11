import { useState } from 'react';
import { Bug, Check, Copy, ExternalLink, Mail } from 'lucide-react';
import { LINKS } from '../data/content';
import { containsAbuseOrSpam } from '../lib/moderation';

const BUG_CATEGORIES = [
  'Audio cutoff or silence gap',
  "Extension didn't activate on Youutube Music",
  'Overlap / fade timing glitch',
  'Popup UI or settings issue',
  'Other bug',
];

export default function BugReportSection() {
  const [category, setCategory] = useState(BUG_CATEGORIES[0]);
  const [setup, setSetup] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);

  function buildReportUrls(report) {
    const title = `[Bug] ${report.category}`;
    const body = [
      `Category: ${report.category}`,
      `Setup: ${report.setup || 'Not specified'}`,
      `Contact: ${report.contact || 'Anonymous'}`,
      '',
      'Details:',
      report.details,
    ].join('\n');

    return {
      plainText: `${title}\n\n${body}`,
      mailtoUrl: `mailto:${LINKS.rawEmail}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
      githubIssueUrl: `${LINKS.githubIssues}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCopied(false);

    const cleanContact = contact.trim();
    const cleanSetup = setup.trim();
    const cleanDetails = details.replace(/\s+/g, ' ').trim();

    if (cleanDetails.length < 10) {
      setError('Please describe what happened in at least 10 characters.');
      return;
    }

    const violation =
      containsAbuseOrSpam(cleanContact) ||
      containsAbuseOrSpam(cleanSetup) ||
      containsAbuseOrSpam(cleanDetails);
    if (violation) {
      setError(violation);
      return;
    }

    const report = {
      category,
      setup: cleanSetup,
      contact: cleanContact,
      details: cleanDetails,
    };
    const urls = buildReportUrls(report);
    setSubmitted(urls);
    window.location.href = urls.mailtoUrl;
  }

  async function handleCopy() {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(submitted.plainText);
      setCopied(true);
    } catch (_) {}
  }

  function handleReset() {
    setDetails('');
    setSetup('');
    setError('');
    setCopied(false);
    setSubmitted(null);
  }

  return (
    <section id="report" className="py-16 md:py-20 bg-[#0b0b0b] border-y border-white/10 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#ffd2d7] mb-2.5">
            Something broke?
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Report a bug or awkward transition.
          </h2>
          <p className="text-[#b3b3b3] text-base md:text-lg max-w-xl mx-auto">
            Youutube Music ships layout updates without warning. If crossfade glitches, skips a track, or refuses to kick in, send a quick report below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#181818] border border-white/15 rounded-2xl p-6 md:p-8"
          noValidate
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#ffd2d7]/15 text-[#ffd2d7] flex items-center justify-center">
                <Bug size={18} />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-white">Quick Bug Report</h3>
                <p className="text-xs text-[#b3b3b3]">
                  Sends straight to Anmol via email or GitHub Issues. Zero tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="bug-category" className="block text-xs font-bold text-white mb-1.5">
                What broke?
              </label>
              <select
                id="bug-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              >
                {BUG_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bug-setup" className="block text-xs font-bold text-white mb-1.5">
                Browser & crossfade setting
              </label>
              <input
                id="bug-setup"
                type="text"
                maxLength={64}
                value={setup}
                onChange={(e) => setSetup(e.target.value)}
                placeholder="e.g. Chrome on Mac, 5s Equal Power"
                className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="bug-contact" className="block text-xs font-bold text-white mb-1.5">
              Your email or @handle (optional)
            </label>
            <input
              id="bug-contact"
              type="text"
              maxLength={64}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="So we can reply when it's fixed"
              className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="bug-details" className="text-xs font-bold text-white">
                What happened? <span className="text-[#ffd2d7]">*</span>
              </label>
              <span className="font-mono text-[11px] text-[#b3b3b3]">{details.length} / 600</span>
            </div>
            <textarea
              id="bug-details"
              rows={4}
              maxLength={600}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us what track transition broke, whether shuffle/autoplay was on, or any console errors you noticed..."
              className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none resize-y"
              required
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-[#f15e6c]" role="alert">
              {error}
            </p>
          )}

          {submitted ? (
            <div className="mt-5 p-4 rounded-xl bg-[#121212] border border-[#1ed760]/40 space-y-3" role="status">
              <p className="text-sm font-bold text-[#1ed760]">
                Report ready! Your email client should open automatically. You can also submit directly via GitHub Issues or copy it below:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={submitted.githubIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1ed760] hover:bg-[#3be477] text-black font-bold text-xs transition-transform hover:scale-105"
                >
                  <ExternalLink size={14} /> Open GitHub Issue
                </a>
                <a
                  href={submitted.mailtoUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black font-bold text-xs transition-transform hover:scale-105"
                >
                  <Mail size={14} /> Send via Email
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/30 hover:border-white text-white font-bold text-xs cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Report'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#b3b3b3] hover:text-white cursor-pointer"
                >
                  Write Another
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#b3b3b3]">
                Opens a prefilled report so nothing is stored on any server.
              </p>
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] text-black font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
              >
                Submit Bug Report
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
