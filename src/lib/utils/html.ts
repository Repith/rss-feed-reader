import DOMPurify from 'isomorphic-dompurify';
import { convert } from 'html-to-text';

export function processContent(html: string) {
  let cleanedHtml = html;
  
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const socialSelectors = [
      '.social', '.share', '.sharing', '.social-share', '.share-buttons', 
      '[class*="social"]', '[class*="share"]', '[id*="social"]', '[id*="share"]',
      '.fb-like', '.facebook-like', '[class*="facebook"]', '[id*="facebook"]',
      '.twitter', '.tweet', '[class*="twitter"]', '[id*="twitter"]',
      '[class*="linkedin"]', '[class*="pinterest"]', '[class*="instagram"]',
      '.newsletter', '.subscribe', '.subscription', '[class*="newsletter"]', '[class*="subscribe"]',
      '.comments', '#comments', '[class*="comment-"]', '[id*="comment-"]',
      '.related', '.read-more', '.more-articles', '[class*="related"]', '[class*="more"]',
      '.ad', '.ads', '.advertisement', '[class*="ad-"]', '[id*="ad-"]',
      '.author-bio', '.bio', '[class*="author-"]',
      'footer', '.footer', '#footer'
    ];
    
    socialSelectors.forEach(selector => {
      const elements = tempDiv.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    const svgs = tempDiv.querySelectorAll('svg');
    svgs.forEach(svg => svg.remove());
    
    const iframes = tempDiv.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src') || '';
      const keepDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com', 'dailymotion.com', 'ted.com'];
      const shouldKeep = keepDomains.some(domain => src.includes(domain));
      if (!shouldKeep) {
        iframe.remove();
      }
    });
    
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      const text = p.textContent?.toLowerCase() || '';
      if (
        text.includes('explore more') || 
        text.includes('read more') || 
        text.includes('related:') ||
        text.includes('follow us') ||
        text.includes('subscribe') ||
        text.includes('sign up for') ||
        text.includes('share this')
      ) {
        p.remove();
      }
    });
    
    const emptyElements = tempDiv.querySelectorAll('p, div');
    emptyElements.forEach(el => {
      if (!el.textContent?.trim() && !el.querySelector('img')) {
        el.remove();
      }
    });
    
    cleanedHtml = tempDiv.innerHTML;
  } catch (e) {
    cleanedHtml = html
      .replace(/<p[^>]*>(?:Share|Follow|Like|Subscribe|Read more|Explore more|Related:|Sign up).*?<\/p>/gi, '')
      .replace(/<div[^>]*(?:social|share|comment|related|newsletter).*?<\/div>/gi, '')
      .replace(/<svg.*?<\/svg>/gi, '');
  }

  const sanitizedHtml = DOMPurify.sanitize(cleanedHtml, {
    ADD_TAGS: ['iframe', 'video', 'audio', 'source', 'track', 'img', 'figure', 'figcaption'],
    ADD_ATTR: [
      'allowfullscreen', 'frameborder', 'src', 'height', 'width', 
      'controls', 'poster', 'autoplay', 'muted', 'loop',
      'alt', 'title', 'loading', 'srcset', 'sizes'
    ],
    FORBID_TAGS: ['script', 'style', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });

  const plainText = convert(sanitizedHtml, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
      { selector: 'svg', format: 'skip' }
    ]
  }).trim();

  let firstImage = null;
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedHtml;
    
    const imgElements = tempDiv.querySelectorAll('img');
    for (const img of imgElements) {
      const src = img.getAttribute('src');
      if (!src) continue;
      
      if (src.endsWith('.svg') || src.includes('data:image/svg+xml')) continue;
      
      const width = parseInt(img.getAttribute('width') || '0', 10);
      const height = parseInt(img.getAttribute('height') || '0', 10);
      
      if ((width > 0 && width < 100) || (height > 0 && height < 100)) continue;
      
      if (
        src.includes('icon') || 
        src.includes('logo') || 
        src.includes('avatar') ||
        src.includes('favicon')
      ) continue;
      
      firstImage = src;
      break;
    }
  } catch (e) {
    const imgMatch = sanitizedHtml.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    if (imgMatch && imgMatch[1]) {
      const src = imgMatch[1];
      if (
        !src.endsWith('.svg') && 
        !src.includes('data:image/svg+xml') &&
        !src.includes('icon') && 
        !src.includes('logo') && 
        !src.includes('avatar')
      ) {
        firstImage = src;
      }
    }
  }

  return { sanitizedHtml, plainText, firstImage };
}
