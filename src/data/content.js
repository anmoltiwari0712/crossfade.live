export const LINKS = {
  cws: 'https://chromewebstore.google.com/detail/crossfade-for-utube-music/efiacbdpmdpecdbkjfpoblkicbnemgno',
  githubProfile: 'https://github.com/anmoltiwari0712',
  githubRepo: 'https://github.com/anmoltiwari0712/CrossFade',
  githubIssues: 'https://github.com/anmoltiwari0712/crossfade.live/issues/new',
  portfolio: 'https://bilkulanmol.vercel.app',
  rawEmail: 'oanmoltiwari7@gmail.com',
  formspreeId: 'xeagqkdv',
  email: 'mailto:oanmoltiwari7@gmail.com?subject=CrossFade%20v2.0%20%E2%80%94%20Hello!',
};

export const COMPARISON_ROWS = [
  '1–12s customizable crossfade',
  '2 audio decks working together',
  '0 awkward gaps (no Wi-Fi panic)',
  'Equal Power & Linear fade curves',
  '100% local browser audio processing',
];

export const PRESET_CARDS = [
  {
    id: 'quick',
    theme: 'pink',
    badge: '1–3 seconds',
    title: 'Quick Cut',
    price: '$0',
    subtitle: 'forever',
    bullets: [
      'No time for emotional goodbyes.',
      'Tight, snappy handoffs for workout & hip-hop mixes.',
      'Equal Power or Linear fade curve.',
    ],
    ctaLabel: 'Try 2s in Live Demo',
    demoSeconds: 2,
    demoCurve: 'equalpower',
  },
  {
    id: 'sweet',
    theme: 'lavender',
    badge: '4–7 seconds · Sweet spot',
    title: 'The Everyday Blend',
    price: '$0',
    subtitle: 'default 5s',
    bullets: [
      'Smooth, natural, and just right.',
      'Keeps Track A vocals crisp while Track B glides in.',
      'Zero mic glitch between tracks.',
    ],
    ctaLabel: 'Fix My Youutube Music',
    href: LINKS.cws,
  },
  {
    id: 'dj',
    theme: 'gold',
    badge: '8–12 seconds',
    title: 'Full DJ Mode',
    price: '$0',
    subtitle: 'headliner',
    bullets: [
      "Because apparently you're headlining tonight.",
      'Deep overlap built for lo-fi, house, and 2 AM drives.',
      'Custom steady Linear or Equal Power blend.',
    ],
    ctaLabel: 'Try 10s in Live Demo',
    demoSeconds: 10,
    demoCurve: 'equalpower',
  },
];

export const STEPS = [
  {
    num: '01',
    color: 'bg-[#ffd2d7] text-black',
    title: 'Bring in the backup',
    body: 'CrossFade prepares the incoming track on a second deck before Song A finishes. Apparently waiting for an invitation is overrated.',
  },
  {
    num: '02',
    color: 'bg-[#c4b1d4] text-black',
    title: 'The smooth handover',
    body: 'Web Audio gain automation fades Song A out while bringing Song B in cleanly. No sudden volume drops. No musical jump scares.',
  },
  {
    num: '03',
    color: 'bg-[#ffc862] text-black',
    title: 'Keep the party going',
    body: "Happens automatically while you listen. You don't touch a thing. Just press play and pretend Youutube Music always worked this way.",
  },
  {
    num: '04',
    color: 'bg-[#a5bbd1] text-black',
    title: '100% local processing',
    body: 'Everything runs directly inside your browser via Chrome audio APIs. Zero external audio-processing servers required.',
  },
];

export const PERSONAS = [
  {
    title: 'The gym warriors',
    accent: 'border-t-[#ffd2d7]',
    body: "You're hitting a PR. The music stops. Suddenly, the only thing dropping is your motivation.",
    punch: "CrossFade isn't responsible for your gains, but it can save your playlist.",
  },
  {
    title: 'The late-night drivers',
    accent: 'border-t-[#c4b1d4]',
    body: "It's 2 AM. The road is empty. The playlist is perfect. And then Youutube Music decides everyone needs a moment of silence.",
    punch: 'Not tonight.',
  },
  {
    title: 'The locked-in students',
    accent: 'border-t-[#ffc862]',
    body: "Three hours into a study session. Noise-cancelling headphones on. Focus at maximum. Then a random silence reminds you that you're actually studying.",
    punch: 'Thanks, YouTube.',
  },
  {
    title: 'The playlist perfectionists',
    accent: 'border-t-[#a5bbd1]',
    body: 'You spent two hours arranging songs in the perfect order.',
    punch: "You really think we're going to let a three-second awkward gap ruin your masterpiece?",
  },
];

export const PRIVACY_FAQS = [
  {
    q: 'What do we store?',
    a: 'Only your three playback preferences: enabled/disabled state, crossfade duration (1–12s), and selected fade curve (Equal Power or Linear), saved locally in Chrome storage.',
  },
  {
    q: 'Why does CrossFade access Youutube Music?',
    a: 'Strictly to attach the dual-deck Web Audio crossfade engine to playback tabs and display its live status inside the extension popup. Zero other websites are ever read.',
  },
  {
    q: "What don't we do?",
    a: 'No telemetry. No tracking scripts. No external API calls. No advertising. No selling your data. Google already knows enough about you, and we do not need to help.',
  },
  {
    q: 'Is it really free with zero tracking?',
    a: 'Yes, free forever, lightweight, and 100% local inside your browser. No account, no subscriptions, no corporate fluff.',
  },
];

