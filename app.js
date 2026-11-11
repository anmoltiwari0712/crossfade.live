/**
 * CrossFade v2.0 Launch Site — Interactive Audio Curve & Gap Demo,
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
      text: 'The chorus of Track A stays crisp while Track B creeps underneath—stopped my 2 AM drive playlists from sounding like a glitchy shuffle.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-2',
      author: '@rhythm_arjun',
      vibe: '7s · Equal Power',
      text: 'Tested it back-to-back across 10+ songs. Zero silence, zero weird mic pop on handoff. Honestly how it should work out of the box.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-3',
      author: 'Maya K.',
      vibe: '5s · Equal Power',
      text: 'Love that it runs 100% locally with zero tracking. Opened my playlist, toggled it on once, and forgot it was an extension.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-4',
      author: '@bassline_kabir',
      vibe: '6s · Equal Power',
      text: 'Wait until a soft outro vocal blends straight into an upbeat bass drop. Saved my gym PR set.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-5',
      author: '@lofi_study_club',
      vibe: '10s · Equal Power',
      text: '10-second overlap for midnight study playlists turns the whole browser tab into one continuous mixtape.',
      createdAt: 'Early listener',
    },
    {
      id: 'seed-6',
      author: 'Sana R.',
      vibe: '2s · Linear',
      text: 'Super clean dark popup UI and works inside the installed web app too. Finally no awkward gaps between bangers.',
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
    return String(input || '')
      .toLowerCase()
      .replace(/[@401!3$57]/g, (ch) => leetMap[ch] || ch)
      .replace(/([a-z])\1{2,}/g, '$1')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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

    return { ok: true, author, text };
  }

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
  const btnAuditionGap = document.getElementById('btnAuditionGap');
  const demoLineA = document.getElementById('demoLineA');
  const demoLineB = document.getElementById('demoLineB');
  const demoAreaA = document.getElementById('demoAreaA');
  const demoAreaB = document.getElementById('demoAreaB');
  const demoPlayhead = document.getElementById('demoPlayhead');
  const demoState = document.getElementById('demoState');
  const demoGainReadout = document.getElementById('demoGainReadout');

  let activeCurve = 'equalpower';
  let activeDuration = 2;
  let audioCtx = null;
  let stopSynthFn = null;

  function formatDurationLabel(sec) {
    return sec === 1 ? '1 second' : `${sec} seconds`;
  }

  function computeGains(p, curve) {
    const clamped = Math.max(0, Math.min(1, p));
    if (curve === 'linear') {
      return { a: 1 - clamped, b: clamped };
    }
    const split = 0.82;
    if (clamped <= split) {
      const t = clamped / split;
      return { a: 1.0 - 0.40 * t, b: 0.48 * t };
    }
    const ht = (clamped - split) / (1 - split);
    return {
      a: 0.60 * Math.cos(ht * Math.PI * 0.5),
      b: 0.48 + 0.52 * Math.sin(ht * Math.PI * 0.5),
    };
  }

  function renderDemoSVG() {
    const W = 360;
    const H = 100;
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

  function ensureAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function spawnChord(ctx, freqs, type, targetGain) {
    return freqs.map((f) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = f;
      osc.connect(targetGain);
      osc.start();
      return osc;
    });
  }

  function stopAnyAudio() {
    if (stopSynthFn) {
      stopSynthFn();
      stopSynthFn = null;
    }
  }

  function playGapDemo() {
    if (stopSynthFn) {
      const wasGap = btnAuditionGap.dataset.playing === '1';
      stopAnyAudio();
      if (wasGap) return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) return;

    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);

    const gainA = ctx.createGain();
    const gainB = ctx.createGain();
    gainA.connect(master);
    gainB.connect(master);

    const oscA = spawnChord(ctx, [174.61, 220.0, 261.63, 329.63], 'triangle', gainA);
    const oscB = spawnChord(ctx, [196.0, 246.94, 293.66, 392.0], 'sine', gainB);

    gainA.gain.value = 1;
    gainB.gain.value = 0;

    btnAuditionGap.dataset.playing = '1';
    btnAuditionGap.textContent = '■ Stop Gap Demo';
    demoState.textContent = 'Playing Before';

    const t1 = setTimeout(() => {
      gainA.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
      demoState.textContent = 'Dead Silence…';
    }, 1000);
    const t2 = setTimeout(() => {
      gainB.gain.setTargetAtTime(1, ctx.currentTime, 0.01);
      demoState.textContent = 'Song B Starts Late';
    }, 2400);
    const t3 = setTimeout(() => {
      stopAnyAudio();
    }, 3800);

    stopSynthFn = () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      [...oscA, ...oscB].forEach((o) => {
        try { o.stop(); o.disconnect(); } catch (_) {}
      });
      try { gainA.disconnect(); gainB.disconnect(); master.disconnect(); } catch (_) {}
      btnAuditionGap.dataset.playing = '0';
      btnAuditionGap.textContent = '▶ Hear the Awkward Gap';
      demoState.textContent = 'Ready';
    };
  }

  function playCrossfadeDemo() {
    if (stopSynthFn) {
      const wasMix = btnAudition.dataset.playing === '1';
      stopAnyAudio();
      if (wasMix) return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) return;

    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);

    const gainA = ctx.createGain();
    const gainB = ctx.createGain();
    gainA.connect(master);
    gainB.connect(master);

    const oscA = spawnChord(ctx, [174.61, 220.0, 261.63, 329.63], 'triangle', gainA);
    const oscB = spawnChord(ctx, [196.0, 246.94, 293.66, 392.0], 'sine', gainB);

    const durationMs = activeDuration * 1000;
    const startTs = performance.now();
    let rafId = 0;
    let endTimer = 0;

    btnAudition.dataset.playing = '1';
    btnAudition.textContent = '■ Stop Demo';
    demoState.textContent = `Crossfading (${activeDuration}s)`;
    demoPlayhead.setAttribute('opacity', '1');

    const cleanup = () => {
      cancelAnimationFrame(rafId);
      clearTimeout(endTimer);
      [...oscA, ...oscB].forEach((o) => {
        try { o.stop(); o.disconnect(); } catch (_) {}
      });
      try { gainA.disconnect(); gainB.disconnect(); master.disconnect(); } catch (_) {}
      btnAudition.dataset.playing = '0';
      btnAudition.textContent = '▶ Play the Demo';
      demoState.textContent = 'Ready';
      demoPlayhead.setAttribute('opacity', '0');
      demoGainReadout.textContent =
        'Locally synthesized audio demo. No actual songs were harmed in the making of this demonstration.';
      stopSynthFn = null;
    };

    stopSynthFn = cleanup;

    function tick(now) {
      const p = Math.min(1, (now - startTs) / durationMs);
      const { a, b } = computeGains(p, activeCurve);
      gainA.gain.setTargetAtTime(a, ctx.currentTime, 0.015);
      gainB.gain.setTargetAtTime(b, ctx.currentTime, 0.015);

      const x = (p * 360).toFixed(1);
      demoPlayhead.setAttribute('x1', x);
      demoPlayhead.setAttribute('x2', x);
      demoGainReadout.textContent =
        `Song A: ${Math.round(a * 100)}% · Song B: ${Math.round(b * 100)}% · Smooth Overlap ${Math.round(p * 100)}%`;

      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        endTimer = setTimeout(() => {
          if (stopSynthFn === cleanup) cleanup();
        }, 400);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  demoDuration.addEventListener('input', () => {
    activeDuration = Number(demoDuration.value);
    demoDurationLabel.textContent = formatDurationLabel(activeDuration);
  });
  btnEqualPower.addEventListener('click', () => setCurveMode('equalpower'));
  btnLinear.addEventListener('click', () => setCurveMode('linear'));
  btnAudition.addEventListener('click', playCrossfadeDemo);
  btnAuditionGap.addEventListener('click', playGapDemo);
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
    } catch (_) {}
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

    const doubled = [...comments, ...comments];
    for (const item of doubled) {
      marqueeTrack.appendChild(createCommentCard(item, item.id === highlightId));
    }

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
    formFeedback.textContent = '✓ Posted! Your feedback is now scrolling across the audience wall.';
  });
})(typeof window !== 'undefined' ? window : globalThis);
