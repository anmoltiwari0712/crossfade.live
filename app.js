/**
 * CrossFade Launch Site — Interactive Audio Curve Demo,
 * Auto Infinite-Scroll Audience Carousel & Abusive Comment Sanity Check.
 */
(function (root) {
  'use strict';

  const STORAGE_KEY = 'crossfade_audience_comments_v1';

  const SEED_COMMENTS = [
    {
      id: 'seed-1',
      author: '@nightdrive_fm',
      vibe: '5s · Equal Power',
      text: 'The chorus of Track A stays crisp while Track B creeps underneath—stopped my late-night drive playlists from sounding like a glitchy shuffle.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-2',
      author: '@rhythm_arjun',
      vibe: '7s · Equal Power',
      text: 'Tested it back-to-back across 10+ songs. Zero silence, zero weird mic pop on handoff. Honestly how streaming should work out of the box.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-3',
      author: 'Maya K.',
      vibe: '5s · Equal Power',
      text: 'Love that it runs completely locally with no sketchy permissions. Opened UTube Music, toggled it on once, and forgot it was an extension.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-4',
      author: '@bassline_kabir',
      vibe: '6s · Equal Power',
      text: 'Wait until a soft outro vocal blends straight into an upbeat bass drop. Pure goosebumps on headphones.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-5',
      author: '@lofi_study_club',
      vibe: '10s · Equal Power',
      text: '10-second overlap for chillhop playlists turns the whole browser tab into one continuous mixtape.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-6',
      author: 'Sana R.',
      vibe: '4s · Linear',
      text: 'Super clean dark popup UI and works inside the installed desktop web app too. Huge upgrade for workout mixes.',
      createdAt: 'Early listener',
    },
  ];

  // Abusive / profanity / slur / harassment / spam-link sanity check.
  // Normalizes leetspeak & repeated chars while preserving word boundaries so
  // legitimate music words like "bass", "classic", "pass", "hello" never trigger false positives.
  const BLOCKED_WORDS = [
    'fuck', 'fucker', 'fucking', 'motherfucker', 'fuk', 'fck',
    'shit', 'bullshit', 'shitty',
    'bitch', 'bitches', 'bitching',
    'asshole', 'arsehole', 'dumbass', 'jackass', 'bastard',
    'cunt', 'dickhead', 'cocksucker', 'prick', 'twat', 'wanker',
    'whore', 'slut', 'skank',
    'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded', 'tranny', 'chink', 'kike', 'spic',
    'crap', 'idiot', 'moron', 'stupid', 'loser', 'pathetic', 'garbage', 'trash',
    'rape', 'rapist', 'pedophile', 'pedo', 'nazi',
    'kys', 'kill yourself', 'go die', 'die in a fire', 'neck yourself',
    'scammer', 'malware', 'phishing',
    'madarchod', 'bhenchod', 'behenchod', 'chutiya', 'chutiye', 'harami', 'kamina', 'kamine',
    'bhosdike', 'bhosdi', 'gaand', 'gandu', 'randi', 'lauda', 'lund', 'mc', 'bc',
  ];

  const OBFUSCATED_PATTERNS = [
    /\bf[\W_]*(?:u|[*#@x])[\W_]*c[\W_]*k/i,
    /\bf[\W_]*u[\W_]*(?:c|[*#@x])[\W_]*k/i,
    /\bs[\W_]*h[\W_]*(?:[i1!]|[*#@])[\W_]*t/i,
    /\bb[\W_]*(?:[i1!]|[*#@])[\W_]*t[\W_]*c[\W_]*h/i,
    /\ba[\W_]*(?:[s$]|[*#@])[\W_]*(?:[s$]|[*#@])[\W_]*h[\W_]*[o0][\W_]*l[\W_]*e/i,
    /\bc[\W_]*(?:u|[*#@])[\W_]*n[\W_]*t/i,
    /\bn[\W_]*(?:[i1!]|[*#@])[\W_]*g[\W_]*g/i,
    /\bk[\W_]*y[\W_]*s\b/i,
  ];

  const SPAM_URL_PATTERN = /(https?:\/\/|www\.|\bt\.me\/|\bdiscord\.gg\b|\bbit\.ly\b|telegram|whatsapp\s*me|free\s*crypto|buy\s*followers|check\s*my\s*bio)/i;
  const SUSPICIOUS_DOMAIN_PATTERN = /(?<![a-z0-9.-])(?!music\.youtube\.com\b)[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(com|net|org|io|xyz|ru|vip|click|top)\b/i;

  function normalizeForCheck(input) {
    const leetMap = {
      '@': 'a',
      '4': 'a',
      '0': 'o',
      '1': 'i',
      '!': 'i',
      '3': 'e',
      '$': 's',
      '5': 's',
      '7': 't',
    };
    const replaced = String(input || '')
      .toLowerCase()
      .replace(/[@401!3$57]/g, (ch) => leetMap[ch] || ch)
      // Collapse 3+ repeated letters down to 1 ("fuuuuck" -> "fuck", "shiiiit" -> "shit")
      .replace(/([a-z])\1{2,}/g, '$1')
      // Replace non-alphanumeric separators with spaces to keep word boundaries clean
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return replaced;
  }

  function containsAbuseOrSpam(raw) {
    const text = String(raw || '').trim();
    if (!text) return null;

    if (SPAM_URL_PATTERN.test(text) || SUSPICIOUS_DOMAIN_PATTERN.test(text)) {
      return 'Links and promotional spam are not allowed on the comment wall.';
    }

    for (const pat of OBFUSCATED_PATTERNS) {
      if (pat.test(text)) {
        return 'Whoa there — keep the vibes respectful. Abusive language was blocked by the sanity check.';
      }
    }

    const normalized = normalizeForCheck(text);
    for (const term of BLOCKED_WORDS) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`, 'i');
      if (re.test(normalized)) {
        return 'Whoa there — keep the vibes respectful. Abusive language was blocked by the sanity check.';
      }
    }

    return null;
  }

  function moderateComment(authorRaw, textRaw) {
    const author = String(authorRaw || '').trim() || 'Anonymous DJ';
    const text = String(textRaw || '').replace(/\s+/g, ' ').trim();

    if (author.length > 32) {
      return { ok: false, reason: 'Keep your name or handle under 32 characters.' };
    }
    if (text.length < 4) {
      return { ok: false, reason: 'Drop at least 4 characters so listeners know what you liked.' };
    }
    if (text.length > 240) {
      return { ok: false, reason: 'Please keep comments under 240 characters.' };
    }
    if (/(.)\1{7,}/.test(text)) {
      return { ok: false, reason: 'Looks like repeated-character spam — try a real note!' };
    }

    const lettersOrDigits = (text.match(/[a-z0-9]/gi) || []).length;
    if (lettersOrDigits < 3) {
      return { ok: false, reason: 'Please write a readable comment.' };
    }

    const authorViolation = containsAbuseOrSpam(author);
    if (authorViolation) {
      return { ok: false, reason: authorViolation };
    }

    const textViolation = containsAbuseOrSpam(text);
    if (textViolation) {
      return { ok: false, reason: textViolation };
    }

    return {
      ok: true,
      author,
      text,
    };
  }

  // Export for Node unit tests when loaded via require()
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { moderateComment, normalizeForCheck };
  }

  if (typeof document === 'undefined') {
    return;
  }

  // ---------------- Interactive Curve & Web Audio Synth Demo ----------------
  const demoDuration = document.getElementById('demoDuration');
  const demoDurationLabel = document.getElementById('demoDurationLabel');
  const btnEqualPower = document.getElementById('btnEqualPower');
  const btnLinear = document.getElementById('btnLinear');
  const btnAudition = document.getElementById('btnAudition');
  const demoLineA = document.getElementById('demoLineA');
  const demoLineB = document.getElementById('demoLineB');
  const demoAreaA = document.getElementById('demoAreaA');
  const demoAreaB = document.getElementById('demoAreaB');
  const demoPlayhead = document.getElementById('demoPlayhead');
  const demoState = document.getElementById('demoState');
  const demoLed = document.getElementById('demoLed');
  const demoGainReadout = document.getElementById('demoGainReadout');

  let activeCurve = 'equalpower';
  let activeDuration = 5;
  let audioCtx = null;
  let stopSynthFn = null;

  // Matches CrossFade's real engine.js gain curve math
  function computeGains(p, curve) {
    const clamped = Math.max(0, Math.min(1, p));
    if (curve === 'linear') {
      return { a: 1 - clamped, b: clamped };
    }
    const split = 0.82;
    if (clamped <= split) {
      const t = clamped / split;
      return {
        a: 1.0 - 0.40 * t,
        b: 0.48 * t,
      };
    }
    const ht = (clamped - split) / (1 - split);
    return {
      a: 0.60 * Math.cos(ht * Math.PI * 0.5),
      b: 0.48 + 0.52 * Math.sin(ht * Math.PI * 0.5),
    };
  }

  function renderDemoSVG() {
    const W = 360;
    const H = 110;
    const padY = 10;
    const steps = 60;
    const ptsA = [];
    const ptsB = [];

    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const x = (p * W).toFixed(1);
      const { a, b } = computeGains(p, activeCurve);
      const yA = (padY + (1 - a) * (H - padY * 2)).toFixed(1);
      const yB = (padY + (1 - b) * (H - padY * 2)).toFixed(1);
      ptsA.push(`${x},${yA}`);
      ptsB.push(`${x},${yB}`);
    }

    const dA = `M ${ptsA.join(' L ')}`;
    const dB = `M ${ptsB.join(' L ')}`;
    demoLineA.setAttribute('d', dA);
    demoLineB.setAttribute('d', dB);
    demoAreaA.setAttribute('d', `${dA} L ${W},${H} L 0,${H} Z`);
    demoAreaB.setAttribute('d', `${dB} L ${W},${H} L 0,${H} Z`);
  }

  function setCurveMode(mode) {
    activeCurve = mode;
    btnEqualPower.classList.toggle('active', mode === 'equalpower');
    btnLinear.classList.toggle('active', mode === 'linear');
    renderDemoSVG();
  }

  function stopAudition() {
    if (stopSynthFn) {
      stopSynthFn();
      stopSynthFn = null;
    }
  }

  function startAudition() {
    if (stopSynthFn) {
      stopAudition();
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      demoState.textContent = 'Audio unsupported';
      return;
    }

    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const master = audioCtx.createGain();
    master.gain.value = 0.22;
    master.connect(audioCtx.destination);

    const gainA = audioCtx.createGain();
    const gainB = audioCtx.createGain();
    gainA.connect(master);
    gainB.connect(master);

    // Warm chord pad for Deck A (Fmaj7 vibe)
    const freqsA = [174.61, 220.0, 261.63, 329.63];
    const oscA = freqsA.map((f) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      osc.connect(gainA);
      osc.start();
      return osc;
    });

    // Brighter chord pad for Song B (G6/Am9 lift)
    const freqsB = [196.0, 246.94, 293.66, 392.0];
    const oscB = freqsB.map((f) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(gainB);
      osc.start();
      return osc;
    });

    const durationMs = activeDuration * 1000;
    const startTs = performance.now();
    let rafId = 0;

    btnAudition.textContent = '■ Stop Audition';
    demoState.textContent = `Mixing (${activeDuration}s)`;
    demoLed.classList.add('playing');
    demoPlayhead.setAttribute('opacity', '1');

    function cleanup() {
      cancelAnimationFrame(rafId);
      [...oscA, ...oscB].forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch (_) {}
      });
      try {
        gainA.disconnect();
        gainB.disconnect();
        master.disconnect();
      } catch (_) {}
      btnAudition.textContent = '▶ Audition Live Synth Mix';
      demoState.textContent = 'Ready';
      demoLed.classList.remove('playing');
      demoPlayhead.setAttribute('opacity', '0');
      demoGainReadout.textContent =
        'Deck A: 100% · Main Deck B: 0% · Synthesized locally with Web Audio API';
      stopSynthFn = null;
    }

    stopSynthFn = cleanup;

    function tick(now) {
      const p = Math.min(1, (now - startTs) / durationMs);
      const { a, b } = computeGains(p, activeCurve);
      gainA.gain.setTargetAtTime(a, audioCtx.currentTime, 0.015);
      gainB.gain.setTargetAtTime(b, audioCtx.currentTime, 0.015);

      const x = (p * 360).toFixed(1);
      demoPlayhead.setAttribute('x1', x);
      demoPlayhead.setAttribute('x2', x);
      demoGainReadout.textContent =
        `Deck A: ${Math.round(a * 100)}% · Main Deck B: ${Math.round(b * 100)}% · Overlap ${Math.round(p * 100)}%`;

      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (stopSynthFn === cleanup) cleanup();
        }, 350);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  demoDuration.addEventListener('input', () => {
    activeDuration = Number(demoDuration.value);
    demoDurationLabel.textContent = `${activeDuration}s`;
  });
  btnEqualPower.addEventListener('click', () => setCurveMode('equalpower'));
  btnLinear.addEventListener('click', () => setCurveMode('linear'));
  btnAudition.addEventListener('click', startAudition);
  renderDemoSVG();

  // ---------------- Audience Infinite Carousel + Moderation ----------------
  const marqueeTrack = document.getElementById('marqueeTrack');
  const commentCount = document.getElementById('commentCount');
  const commentForm = document.getElementById('commentForm');
  const authorInput = document.getElementById('authorInput');
  const vibeInput = document.getElementById('vibeInput');
  const commentInput = document.getElementById('commentInput');
  const charCounter = document.getElementById('charCounter');
  const formFeedback = document.getElementById('formFeedback');

  function loadComments() {
    let saved = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Run sanity check on stored entries too so abusive content never survives
          saved = parsed.filter((item) => {
            if (!item || typeof item.text !== 'string') return false;
            return moderateComment(item.author, item.text).ok;
          });
        }
      }
    } catch (_) {
      saved = [];
    }
    return [...saved, ...SEED_COMMENTS];
  }

  function saveUserComments(userComments) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userComments.slice(0, 25)));
    } catch (_) {
      // Ignore storage quota errors cleanly
    }
  }

  function createCommentCard(item, isNew) {
    const card = document.createElement('article');
    card.className = 'comment-card' + (isNew ? ' is-new' : '');

    const textEl = document.createElement('p');
    textEl.className = 'comment-text';
    textEl.textContent = `“${item.text}”`;

    const meta = document.createElement('div');
    meta.className = 'comment-meta';

    const authorWrap = document.createElement('div');
    authorWrap.className = 'comment-author-wrap';

    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    const cleanInitial = (item.author || 'A').replace(/^@/, '').trim().charAt(0).toUpperCase() || 'A';
    avatar.textContent = cleanInitial;

    const nameBlock = document.createElement('div');
    const nameEl = document.createElement('div');
    nameEl.className = 'author-name';
    nameEl.textContent = item.author;

    const vibeEl = document.createElement('div');
    vibeEl.className = 'comment-vibe';
    vibeEl.textContent = item.vibe || '5s · Equal Power';

    nameBlock.appendChild(nameEl);
    nameBlock.appendChild(vibeEl);
    authorWrap.appendChild(avatar);
    authorWrap.appendChild(nameBlock);

    const timeEl = document.createElement('span');
    timeEl.className = 'comment-time';
    timeEl.textContent = item.createdAt || 'Just now';

    meta.appendChild(authorWrap);
    meta.appendChild(timeEl);

    card.appendChild(textEl);
    card.appendChild(meta);
    return card;
  }

  function renderCarousel(comments, highlightId) {
    marqueeTrack.textContent = '';
    commentCount.textContent = String(comments.length);

    // Clone list twice so translate3d(-50%, 0, 0) loops seamlessly without gaps
    const doubled = [...comments, ...comments];
    for (const item of doubled) {
      marqueeTrack.appendChild(createCommentCard(item, item.id === highlightId));
    }

    // Scale scroll duration gently with number of comments (~6s per card)
    const durationSec = Math.max(24, comments.length * 6);
    marqueeTrack.style.setProperty('--marquee-duration', `${durationSec}s`);
  }

  let allComments = loadComments();
  renderCarousel(allComments, null);

  commentInput.addEventListener('input', () => {
    charCounter.textContent = `${commentInput.value.length} / 240`;
  });

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.className = 'form-feedback';
    formFeedback.textContent = '';

    const result = moderateComment(authorInput.value, commentInput.value);
    if (!result.ok) {
      formFeedback.className = 'form-feedback error';
      formFeedback.textContent = result.reason;
      return;
    }

    const newEntry = {
      id: `user-${Date.now()}`,
      author: result.author,
      vibe: vibeInput.value,
      text: result.text,
      createdAt: 'Just now',
    };

    const existingUserComments = allComments.filter((c) => !String(c.id).startsWith('seed-'));
    const updatedUserComments = [newEntry, ...existingUserComments];
    saveUserComments(updatedUserComments);

    allComments = [...updatedUserComments, ...SEED_COMMENTS];
    renderCarousel(allComments, newEntry.id);

    commentInput.value = '';
    charCounter.textContent = '0 / 240';
    formFeedback.className = 'form-feedback success';
    formFeedback.textContent = '✓ Posted! Your vibe is now gliding across the audience carousel.';
  });
})(typeof window !== 'undefined' ? window : globalThis);
