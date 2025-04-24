import { Article } from "@/src/domain/models/Article";
import { Feed } from "@/src/domain/models/Feed";
import Parser from "rss-parser";
import axios from "axios";
import { JSDOM } from 'jsdom';
import { processContent } from '@/src/lib/utils/html';
import { parseAtomFeed, parseRssFeed, createFallbackArticle } from '@/src/lib/utils/feed-parsers';

export class RssParserService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
      customFields: {
        item: ["content:encoded", "description", "media:content", "enclosure"],
        feed: ["image", "language"]
      },
      timeout: 60000,
      requestOptions: {
        rejectUnauthorized: false,
      },
      defaultRSS: 2.0,
      xml2js: {
        normalize: true,
        normalizeTags: true,
        explicitArray: false,
      },
    });
  }

  async parseFeed(url: string): Promise<{
    feed: Partial<Feed>;
    articles: Omit<Article, "id" | "createdAt">[];
  }> {
    try {
      try {
        const parsedFeed = await this.parser.parseURL(url);
        return this.processParsedFeed(url, parsedFeed);
      } catch (_) {
        const response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
          },
          timeout: 60000,
          responseType: 'text',
          validateStatus: () => true,
        });
        
        if (response.status >= 400) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        return this.parseXmlContent(url, response.data);
      }
    } catch (error) {
      console.error("Error parsing RSS feed:", error);
      throw new Error(`Failed to parse RSS feed: ${(error as Error).message || 'Unknown error'}`);
    }
  }
  
  private async parseXmlContent(url: string, xmlContent: string) {
    try {
      const parsedFeed = await this.parser.parseString(xmlContent);
      
      if (!parsedFeed || typeof parsedFeed !== 'object') {
        throw new Error('Invalid feed format: Feed object is missing');
      }
      
      return this.processParsedFeed(url, parsedFeed);
    } catch (_) {
      if (xmlContent.includes('<feed') && xmlContent.includes('xmlns="http://www.w3.org/2005/Atom"')) {
        return parseAtomFeed(url, xmlContent);
      } else if (xmlContent.includes('<rss') || xmlContent.includes('<channel')) {
        return parseRssFeed(url, xmlContent);
      } else if (xmlContent.includes('<?xml')) {
        return this.processGenericXmlFeed(url, xmlContent);
      } else {
        return this.extractFallbackContent(url, xmlContent);
      }
    }
  }
  
  private processParsedFeed(url: string, parsedFeed: Parser.Output<any>): {
    feed: Partial<Feed>;
    articles: Omit<Article, "id" | "createdAt">[];
  } {
    const feed: Partial<Feed> = {
      url,
      title: parsedFeed.title || "Unnamed Feed",
      description: parsedFeed.description || "",
      lastFetched: new Date(),
    };

    const articles = (parsedFeed.items || []).map((item) => {
      let imageUrl = null;
      try {
        const mediaContent = item["media:content"] || item.enclosure;
        imageUrl = mediaContent?.url || mediaContent?.$.url || null;
      } catch (_) {
      }

      const rawContent = item['content:encoded'] ?? item.content ?? item.description ?? '';
      const stringContent = typeof rawContent === 'string' ? rawContent : (rawContent?.toString() || '');
      const { sanitizedHtml, plainText, firstImage } = processContent(stringContent);

      return {
        feedId: "",
        title: item.title || "Untitled",
        content: sanitizedHtml,
        snippet: plainText.slice(0, 400), // Create a 400 character snippet
        link: item.link || "",
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        author: item.creator || item.author || (item.dc && item.dc.creator) || "",
        imageUrl: firstImage || imageUrl,
        isRead: false,
        isFavorite: false,
      };
    });

    return { feed, articles };
  }
  
  private processGenericXmlFeed(url: string, xmlContent: string) {
    try {
      if (xmlContent.includes('<channel>')) {
        return parseRssFeed(url, xmlContent);
      } else if (xmlContent.includes('<feed')) {
        return parseAtomFeed(url, xmlContent);
      }
      
      const dom = new JSDOM(xmlContent, { contentType: 'text/xml' });
      const doc = dom.window.document;
      
      const titleElement = doc.querySelector('title') || 
                          doc.querySelector('name') || 
                          doc.querySelector('heading');
      const feedTitle = titleElement?.textContent || 'Unnamed Feed';
      
      const descElement = doc.querySelector('description') || 
                         doc.querySelector('subtitle') || 
                         doc.querySelector('summary');
      const feedDescription = descElement?.textContent || '';
      
      const feed: Partial<Feed> = {
        url,
        title: feedTitle,
        description: feedDescription,
        lastFetched: new Date(),
      };
      
      const items = Array.from(doc.querySelectorAll('item, entry, article') || []);
      
      if (!items.length) {
        return { feed, articles: [] };
      }
      
      const articles = items.map(item => {
        const title = item.querySelector('title')?.textContent || 'Untitled';
        const link = item.querySelector('link')?.textContent || 
                    item.querySelector('link')?.getAttribute('href') || '';
        const pubDate = item.querySelector('pubDate, published, date')?.textContent || '';
        const author = item.querySelector('author, creator')?.textContent || '';
        
        const contentElements = item.querySelectorAll('content, description, summary, body');
        let rawContent = '';
        for (const el of Array.from(contentElements)) {
          if (el.textContent && el.textContent.length > rawContent.length) {
            rawContent = el.textContent;
          }
        }
        
        const { sanitizedHtml, plainText, firstImage } = processContent(rawContent);
        
        return {
          feedId: '',
          title,
          content: sanitizedHtml,
          snippet: plainText.slice(0, 400), // Create a 400 character snippet
          link,
          publishedAt: pubDate ? new Date(pubDate) : new Date(),
          author,
          imageUrl: firstImage,
          isRead: false,
          isFavorite: false,
        };
      });
      
      return { feed, articles };
    } catch (error) {
      return {
        feed: { url, title: 'Failed to parse feed', lastFetched: new Date() },
        articles: []
      };
    }
  }

  private extractFallbackContent(url: string, content: string) {
    try {
      const dom = new JSDOM(content);
      const doc = dom.window.document;
      
      const title = doc.querySelector('title')?.textContent || 
                   doc.querySelector('h1')?.textContent || 
                   'Unnamed Feed';
      
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      const feed: Partial<Feed> = {
        url,
        title,
        description: metaDescription,
        lastFetched: new Date(),
      };
      
      const articles: Omit<Article, "id" | "createdAt">[] = [];
      
      const articleElements = doc.querySelectorAll('article, .post, .entry, .article');
      
      if (articleElements.length > 0) {
        articleElements.forEach(article => {
          const articleTitle = article.querySelector('h1, h2, h3, .title')?.textContent || 'Untitled';
          const articleLink = article.querySelector('a')?.getAttribute('href') || '';
          const fullLink = articleLink.startsWith('http') ? articleLink : new URL(articleLink, url).href;
          
          const { sanitizedHtml, plainText } = processContent(article.innerHTML);
          
          articles.push({
            feedId: '',
            title: articleTitle,
            content: sanitizedHtml,
            snippet: plainText.slice(0, 400), 
            link: fullLink,
            publishedAt: new Date(),
            author: '',
            isRead: false,
            isFavorite: false,
          });
        });
      } else {
        const mainContent = doc.querySelector('main') || 
                           doc.querySelector('#content') || 
                           doc.querySelector('.content') || 
                           doc.body;
        
        if (mainContent) {
          const { sanitizedHtml, plainText } = processContent(mainContent.innerHTML);
          
          articles.push({
            feedId: '',
            title,
            content: sanitizedHtml,
            snippet: plainText.slice(0, 400),
            link: url,
            publishedAt: new Date(),
            author: '',
            isRead: false,
            isFavorite: false,
          });
        }
      }
      
      return { feed, articles: articles.length > 0 ? articles : [createFallbackArticle(url)[0]] };
    } catch (error) {
      console.error('Error in extractFallbackContent:', error);
      return {
        feed: { url, title: 'Failed to parse feed', lastFetched: new Date() },
        articles: createFallbackArticle(url)
      };
    }
  }

}
