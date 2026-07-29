import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'div', 'span',
  'b', 'i', 'u', 'strong', 'em', 'del', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'img',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title'];

export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, { ALLOWED_TAGS, ALLOWED_ATTR });
}
