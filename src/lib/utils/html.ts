import createDOMPurify from 'isomorphic-dompurify';
import { htmlToText } from 'html-to-text';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export interface ProcessedContent {
  sanitizedHtml: string;
  plainText: string;
  firstImage: string | null;
}

export function sanitizeHtml(rawHtml = ''): string {
  const htmlString = typeof rawHtml === 'string' ? rawHtml : String(rawHtml || '');
  
  const cleanedHtml = decodeHtmlEntities(htmlString.replace(/<!\[CDATA\[(.*?)\]\]>/gsi, '$1'));

  const sanitizedHtml = DOMPurify.sanitize(cleanedHtml, {
    ALLOWED_TAGS: [
      'br', 'ul', 'ol', 'li',
      'strong', 'em', 'b', 'i', 'blockquote',
    ],
    ALLOW_ARIA_ATTR: false,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false
  });

  return sanitizedHtml
}

export function extractPlainText(html: string): string {
  const dom = new JSDOM(`<body>${html}</body>`);
  const { document } = dom.window;
  
  document.querySelectorAll('img').forEach((img) => {
    const alt = img.getAttribute('alt') || '';
    img.replaceWith(document.createTextNode(alt ? `${alt} ` : ''));
  });
  
  document.querySelectorAll('a').forEach((a) => {
    a.replaceWith(document.createTextNode(a.textContent || ''));
  });
  
  return htmlToText(document.body.innerHTML, {
    wordwrap: false,
    selectors: [
      { selector: 'p', format: 'paragraph' },
      { selector: 'br', format: 'lineBreak' },
    ],
    tags: { 'a': { options: { ignoreHref: true } } }
  }).trim();
}

export function findFirstImage(html: string): string | null {
  const dom = new JSDOM(`<body>${html}</body>`);
  const img = dom.window.document.querySelector('img');
  const src = img?.getAttribute('src');
  
  if (src && src.trim() !== '') {
    return src;
  }
  
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
  return imgMatch ? imgMatch[1] : null;
}

export function processContent(rawHtml = ''): ProcessedContent {
  const cleanedHtml = decodeHtmlEntities(
    typeof rawHtml === 'string' ? rawHtml : String(rawHtml || '')
  ).replace(/<!\[CDATA\[(.*?)\]\]>/gsi, '$1');
  
  const sanitizedHtml = sanitizeHtml(cleanedHtml);
  const plainText = extractPlainText(cleanedHtml);
  const firstImage = findFirstImage(cleanedHtml);
  
  return { sanitizedHtml, plainText, firstImage };
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}



