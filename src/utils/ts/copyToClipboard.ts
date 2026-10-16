/**
 * 텍스트를 클립보드에 복사한다.
 * Clipboard API가 막힌 환경(비보안 출처, 일부 인앱 웹뷰)에서는 임시 textarea와 `execCommand('copy')`로 복사한다.
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
}
