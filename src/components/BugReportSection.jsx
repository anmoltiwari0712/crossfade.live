import { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Bug, CheckCircle2, ChevronDown } from 'lucide-react';
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
  const [state, handleFormspreeSubmit, resetFormspree] = useForm(LINKS.formspreeId);
  const [category, setCategory] = useState(BUG_CATEGORIES[0]);
  const [setup, setSetup] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [clientError, setClientError] = useState('');

  async function onSubmit(e) {
    setClientError('');

    const cleanContact = contact.trim();
    const cleanSetup = setup.trim();
    const cleanDetails = details.replace(/\s+/g, ' ').trim();

    if (cleanDetails.length < 10) {
      e.preventDefault();
      setClientError('Please describe what happened in at least 10 characters.');
      return;
    }

    const violation =
      containsAbuseOrSpam(cleanContact) ||
      containsAbuseOrSpam(cleanSetup) ||
      containsAbuseOrSpam(cleanDetails);
    if (violation) {
      e.preventDefault();
      setClientError(violation);
      return;
    }

    await handleFormspreeSubmit(e);
  }

  function handleReset() {
    setDetails('');
    setSetup('');
    setContact('');
    setCategory(BUG_CATEGORIES[0]);
    setClientError('');
    resetFormspree();
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

        {state.succeeded ? (
          <div
            className="bg-[#181818] border border-[#1ed760]/40 rounded-2xl p-8 md:p-10 text-center"
            role="status"
          >
            <span className="w-12 h-12 rounded-full bg-[#1ed760]/15 text-[#1ed760] inline-flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-2">Bug report sent!</h3>
            <p className="text-sm md:text-base text-[#b3b3b3] max-w-md mx-auto mb-6">
              Thanks for helping improve CrossFade. Your report has been delivered directly to Anmol’s inbox.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-full border border-white/30 hover:border-white text-white font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
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
                    Delivered straight to Anmol’s inbox. Zero tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="bug-category" className="block text-xs font-bold text-white mb-1.5">
                  What broke?
                </label>
                <div className="relative">
                  <select
                    id="bug-category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 appearance-none bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl pl-3.5 pr-10 text-sm text-white outline-none cursor-pointer transition-colors"
                  >
                    {BUG_CATEGORIES.map((item) => (
                      <option key={item} value={item} className="bg-[#121212] text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b3b3b3]"
                  />
                </div>
                <ValidationError
                  prefix="Category"
                  field="category"
                  errors={state.errors}
                  className="mt-1 text-xs text-[#f15e6c]"
                />
              </div>

              <div>
                <label htmlFor="bug-setup" className="block text-xs font-bold text-white mb-1.5">
                  Browser & crossfade setting
                </label>
                <input
                  id="bug-setup"
                  name="setup"
                  type="text"
                  maxLength={64}
                  value={setup}
                  onChange={(e) => setSetup(e.target.value)}
                  placeholder="e.g. Chrome on Mac, 5s Equal Power"
                  className="w-full h-11 bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 text-sm text-white placeholder:text-[#727272] outline-none transition-colors"
                />
                <ValidationError
                  prefix="Setup"
                  field="setup"
                  errors={state.errors}
                  className="mt-1 text-xs text-[#f15e6c]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="bug-contact" className="block text-xs font-bold text-white mb-1.5">
                Your email or @handle (optional)
              </label>
              <input
                id="bug-contact"
                name="contact"
                type="text"
                maxLength={64}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="So we can reply when it's fixed"
                className="w-full h-11 bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl px-3.5 text-sm text-white placeholder:text-[#727272] outline-none transition-colors"
              />
              <ValidationError
                prefix="Contact"
                field="contact"
                errors={state.errors}
                className="mt-1 text-xs text-[#f15e6c]"
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
                name="details"
                rows={4}
                minLength={10}
                maxLength={600}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us what track transition broke, whether shuffle/autoplay was on, or any console errors you noticed..."
                className="w-full bg-[#121212] border border-white/20 focus:border-[#ffd2d7] rounded-xl p-3.5 text-sm text-white placeholder:text-[#727272] outline-none resize-y transition-colors"
                required
              />
              <ValidationError
                prefix="Details"
                field="details"
                errors={state.errors}
                className="mt-1 text-xs text-[#f15e6c]"
              />
            </div>

            {clientError && (
              <p className="mt-3 text-sm text-[#f15e6c]" role="alert">
                {clientError}
              </p>
            )}
            <ValidationError
              errors={state.errors}
              className="mt-3 text-sm text-[#f15e6c]"
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#b3b3b3]">
                Sent directly without leaving this page.
              </p>
              <button
                type="submit"
                disabled={state.submitting}
                className="px-7 py-3 rounded-full bg-[#ffd2d7] hover:bg-[#ffe5e8] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-sm transition-transform hover:scale-105 cursor-pointer"
              >
                {state.submitting ? 'Sending...' : 'Submit Bug Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
