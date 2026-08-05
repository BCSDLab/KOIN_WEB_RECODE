import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const getWindow = (): Window & typeof globalThis => {
  if (typeof window !== 'undefined') return window;
  return new JSDOM('').window as unknown as Window & typeof globalThis;
};

const DOMPurify = createDOMPurify(getWindow());

const BLOCKED_CSS_PROPERTIES = ['position'];

// url()로 스크립트를 실행하거나 외부 스타일시트를 불러오는 벡터 
// css 인젝션 방지
const DANGEROUS_CSS_PATTERNS = [/javascript\s*:/i, /@import/i];

const filterDangerousCss = (styleValue: string): string =>
  styleValue
    .split(';')
    .map((declaration) => declaration.trim())
    .filter((declaration) => {
      if (!declaration) return false;
      const [rawProperty] = declaration.split(':');
      if (!rawProperty) return false;
      const property = rawProperty.trim().toLowerCase();
      if (BLOCKED_CSS_PROPERTIES.includes(property)) return false;
      return !DANGEROUS_CSS_PATTERNS.some((pattern) => pattern.test(declaration));
    })
    .join('; ');

DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName !== 'style') return;
  data.attrValue = filterDangerousCss(data.attrValue);
});

const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'div', 'span',
  'b', 'i', 'u', 'strong', 'em', 'del', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'img',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'style'];

export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, { ALLOWED_TAGS, ALLOWED_ATTR });
}
