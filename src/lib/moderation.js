/**
 * Client-side abusive language, slur, obfuscation, and spam-link sanity check.
 * Preserves word boundaries so legitimate music terms ("bass", "classic", "pass", "hello") pass.
 */

export const STORAGE_KEY = 'crossfade_audience_comments_v2';

export const SEED_COMMENTS = [
  {
    id: 'seed-1',
    author: '@nightdrive_fm',
    vibe: '5s · Equal Power',
    accent: 'pink',
    text: 'The chorus of Track A stays crisp while Track B creeps underneath. Stopped my 2 AM drive playlists from sounding like a glitchy shuffle.',
    createdAt: 'Early listener',
  },
  {
    id: 'seed-2',
    author: '@rhythm_arjun',
    vibe: '7s · Equal Power',
    accent: 'lavender',
    text: 'Tested it back-to-back across 10+ songs. Zero silence, zero weird mic pop on handoff. Honestly how it should work out of the box.',
    createdAt: 'Early listener',
  },
  {
    id: 'seed-3',
    author: 'Maya K.',
    vibe: '5s · Equal Power',
    accent: 'gold',
    text: 'Love that it runs 100% locally with zero tracking. Opened my playlist, toggled it on once, and forgot it was an extension.',
    createdAt: 'Early listener',
  },
  {
    id: 'seed-4',
    author: '@bassline_kabir',
    vibe: '6s · Equal Power',
    accent: 'blue',
    text: 'Wait until a soft outro vocal blends straight into an upbeat bass drop. Saved my gym PR set.',
    createdAt: 'Early listener',
  },
  {
    id: 'seed-5',
    author: '@lofi_study_club',
    vibe: '10s · Equal Power',
    accent: 'green',
    text: '10-second overlap for midnight study playlists turns the whole browser tab into one continuous mixtape.',
    createdAt: 'Early listener',
  },
  {
    id: 'seed-6',
    author: 'Sana R.',
    vibe: '2s · Linear',
    accent: 'pink',
    text: 'Super clean popup UI and works inside the installed web app too. Finally no awkward gaps between bangers.',
    createdAt: 'Early listener',
  },
];

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

const SPAM_URL_PATTERN =
  /(https?:\/\/|www\.|\bt\.me\/|\bdiscord\.gg\b|\bbit\.ly\b|telegram|whatsapp\s*me|free\s*crypto|buy\s*followers|check\s*my\s*bio)/i;
const SUSPICIOUS_DOMAIN_PATTERN =
  /(?<![a-z0-9.-])(?!music\.youtube\.com\b)[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(com|net|org|io|xyz|ru|vip|click|top)\b/i;

export function normalizeForCheck(input) {
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
      return 'Whoa there, keep the vibes respectful. Abusive language was blocked by the sanity check.';
    }
  }

  const normalized = normalizeForCheck(text);
  for (const term of BLOCKED_WORDS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(normalized)) {
      return 'Whoa there, keep the vibes respectful. Abusive language was blocked by the sanity check.';
    }
  }

  return null;
}

export function moderateComment(authorRaw, textRaw) {
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
    return { ok: false, reason: 'Looks like repeated-character spam. Try a real note!' };
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

