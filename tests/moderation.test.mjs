import assert from 'node:assert';
import { moderateComment } from '../src/lib/moderation.js';

const shouldPass = [
  ['@dj_anmol', 'Smooth bass drop transition, hello zero silence!'],
  ['ClassicFan', 'This classic equal power curve never cuts the vocal early.'],
  ['', 'Works cleanly on music.youtube.com without lag!'],
  ['Listener99', 'Hard pass on abrupt cuts, love this extension!'],
];

const shouldBlock = [
  ['Anon', 'This is fucking terrible'],
  ['Anon', 'You are a b1tch and an a$$hole'],
  ['Anon', 'f.u.c.k this'],
  ['Anon', 'kill yourself'],
  ['Spammer', 'Visit https://free-crypto-win.com now!'],
  ['Spammer', 'Check promo.xyz for deals'],
  ['Anon', 'aaaaaaaaaaaaaa'],
  ['Anon', 'hi'],
  ['f*cker', 'Nice extension!'],
];

for (const [author, text] of shouldPass) {
  const res = moderateComment(author, text);
  assert.strictEqual(res.ok, true, `Expected PASS for (${author}, ${text}) but got: ${res.reason}`);
}

for (const [author, text] of shouldBlock) {
  const res = moderateComment(author, text);
  assert.strictEqual(res.ok, false, `Expected BLOCK for (${author}, ${text})`);
}

console.log(`All ${shouldPass.length + shouldBlock.length} moderation tests passed.`);
