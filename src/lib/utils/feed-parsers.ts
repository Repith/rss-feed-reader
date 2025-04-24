import { Article } from "@/src/domain/models/Article";
import { Feed } from "@/src/domain/models/Feed";
import { JSDOM } from 'jsdom';
import { processContent } from './html';

export function parseAtomFeed(url: string, xmlContent: string): {
  feed: Partial<Feed>;
  articles: Omit<Article, "id" | "createdAt">[];
} {
  const dom = new JSDOM(xmlContent, { contentType: 'text/xml' });
  const doc = dom.window.document;
  
  const feedTitle = doc.querySelector('feed > title')?.textContent || 'Unnamed Feed';
  const feedDescription = doc.querySelector('feed > subtitle')?.textContent || '';
  
  const feed: Partial<Feed> = {
    url,
    title: feedTitle,
    description: feedDescription,
    lastFetched: new Date(),
  };
  
  const entries = Array.from(doc.querySelectorAll('entry') || []);
  
  if (!entries.length) {
    return { feed, articles: [] };
  }
  
  const articles = entries.map(entry => {
    const title = entry.querySelector('title')?.textContent || 'Untitled';
    const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || 
                entry.querySelector('link')?.getAttribute('href') || '';
    const pubDate = entry.querySelector('published')?.textContent || 
                   entry.querySelector('updated')?.textContent || '';
    const author = entry.querySelector('author > name')?.textContent || '';
    
    const content = entry.querySelector('content')?.textContent || 
                   entry.querySelector('summary')?.textContent || '';
    
    const { sanitizedHtml, plainText, firstImage } = processContent(content);
    
    return {
      feedId: '',
      title,
      content: sanitizedHtml, 
      snippet: plainText.slice(0, 400), 
      link,
      publishedAt: pubDate ? new Date(pubDate) : new Date(),
      author,
      imageUrl: firstImage,
      isRead: false,
      isFavorite: false,
    };
  });
  
  return { feed, articles };
}

export function parseRssFeed(url: string, xmlContent: string): {
  feed: Partial<Feed>;
  articles: Omit<Article, "id" | "createdAt">[];
} {
  const dom = new JSDOM(xmlContent, { contentType: 'text/xml' });
  const doc = dom.window.document;
  
  const feedTitle = doc.querySelector('channel > title')?.textContent || 'Unnamed Feed';
  const feedDescription = doc.querySelector('channel > description')?.textContent || '';
  
  const feed: Partial<Feed> = {
    url,
    title: feedTitle,
    description: feedDescription,
    lastFetched: new Date(),
  };
  
  const items = Array.from(doc.querySelectorAll('item') || []);
  
  if (!items.length) {
    return { feed, articles: [] };
  }
  
  const articles = items.map(item => {
    const title = item.querySelector('title')?.textContent || 'Untitled';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const author = item.querySelector('author')?.textContent || 
                  item.querySelector('dc\\:creator')?.textContent || '';
    
    const contentEncoded = item.querySelector('content\\:encoded')?.textContent;
    const description = item.querySelector('description')?.textContent;
    const rawContent = contentEncoded || description || '';
    
    const { sanitizedHtml, plainText, firstImage } = processContent(rawContent);
    
    let mediaImage = null;
    const mediaContent = item.querySelector('media\\:content');
    const enclosure = item.querySelector('enclosure');
    
    if (mediaContent && mediaContent.getAttribute('url')) {
      mediaImage = mediaContent.getAttribute('url');
    } else if (enclosure && enclosure.getAttribute('url') && 
              enclosure.getAttribute('type')?.startsWith('image/')) {
      mediaImage = enclosure.getAttribute('url');
    }
    
    return {
      feedId: '',
      title,
      content: sanitizedHtml,
      snippet: plainText.slice(0, 400), 
      link,
      publishedAt: pubDate ? new Date(pubDate) : new Date(),
      author,
      imageUrl: firstImage || mediaImage,
      isRead: false,
      isFavorite: false,
    };
  });
  
  return { feed, articles };
}

export function createFallbackArticle(url: string, content?: string): Omit<Article, "id" | "createdAt">[] {
  const plainText = content ? content.replace(/<[^>]*>/g, "") : "Could not parse content from this feed. Please check the URL.";
  
  return [{
    feedId: "",
    title: "Content from " + new URL(url).hostname,
    content: content || "Could not parse content from this feed. Please check the URL.",
    snippet: plainText.slice(0, 400), 
    link: url,
    publishedAt: new Date(),
    author: "",
    isRead: false,
    isFavorite: false,
  }];
}




