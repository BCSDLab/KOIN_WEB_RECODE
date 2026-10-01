const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const DIGITS_WITH_FINAL_CONSONANT = new Set(['0', '1', '3', '6', '7', '8']);

/** 마지막 글자의 받침 유무. 영문 등 알 수 없는 글자는 null. */
function hasFinalConsonant(word: string) {
  const lastChar = word.trim().slice(-1);
  if (!lastChar) return null;

  const code = lastChar.charCodeAt(0);
  if (code >= HANGUL_START && code <= HANGUL_END) return (code - HANGUL_START) % 28 !== 0;
  if (/[0-9]/.test(lastChar)) return DIGITS_WITH_FINAL_CONSONANT.has(lastChar);

  return null;
}

export function getObjectParticle(word: string) {
  const hasFinal = hasFinalConsonant(word);
  if (hasFinal === null) return '을(를)';

  return hasFinal ? '을' : '를';
}

export function getTopicParticle(word: string) {
  const hasFinal = hasFinalConsonant(word);
  if (hasFinal === null) return '은(는)';

  return hasFinal ? '은' : '는';
}
