const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const DIGITS_WITH_FINAL_CONSONANT = new Set(['0', '1', '3', '6', '7', '8']);

/** 목적격 조사를 고른다. 받침을 알 수 없는 글자(영문 등)는 '을(를)'을 반환한다. */
export default function getObjectParticle(word: string) {
  const lastChar = word.trim().slice(-1);
  if (!lastChar) return '을(를)';

  const code = lastChar.charCodeAt(0);
  if (code >= HANGUL_START && code <= HANGUL_END) {
    return (code - HANGUL_START) % 28 === 0 ? '를' : '을';
  }
  if (/[0-9]/.test(lastChar)) {
    return DIGITS_WITH_FINAL_CONSONANT.has(lastChar) ? '을' : '를';
  }

  return '을(를)';
}
