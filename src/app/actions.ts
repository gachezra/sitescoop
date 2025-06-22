'use server';

import { suggestSelectors } from '@/ai/flows/ai-selector-suggestions';
import { summarizeData } from '@/ai/flows/data-summarization';
import type { SelectorMap, Product } from '@/types';
import * as cheerio from 'cheerio';

export async function getScrapingSuggestions(url: string): Promise<SelectorMap | null> {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
    if (!response.ok) {
      console.error(`Error fetching URL: ${response.statusText}`);
      return null;
    }
    const htmlContent = await response.text();

    const result = await suggestSelectors({ url, content: htmlContent });
    return result;
  } catch (error) {
    console.error("Error getting selector suggestions:", error);
    return null;
  }
}

export async function scrapeWebsite(url: string, selectors: SelectorMap): Promise<Product[]> {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        if (!response.ok) {
          throw new Error(`Failed to fetch page: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
    
        const scrapedProducts: Product[] = [];
        
    
        $(selectors.container).each((index, element) => {
          const name = $(element).find(selectors.name).text().trim();
          const priceStr = $(element).find(selectors.price).text().trim().replace(/[^0-9.-]+/g, "");
          const ratingStr = $(element).find(selectors.rating).text().trim().replace(/[^0-9.-]+/g, "");
          let imageUrl = $(element).find(selectors.imageUrl).attr('src') || $(element).find(selectors.imageUrl).attr('data-src') || '';

          if (imageUrl) {
            try {
                imageUrl = new URL(imageUrl, url).href;
            } catch (e) {
                console.warn(`Invalid image URL found: ${imageUrl}`);
                imageUrl = `https://placehold.co/100x100.png`;
            }
          }

          if (name && priceStr) {
            scrapedProducts.push({
                id: `${index}-${name}`,
                name,
                price: parseFloat(priceStr) || 0,
                rating: parseFloat(ratingStr) || 0,
                imageUrl: imageUrl || `https://placehold.co/100x100.png`
            });
          }
        });
    
        return scrapedProducts;
    } catch (error) {
        console.error("Error scraping website:", error);
        return [];
    }
}


export async function getSummary(data: string, url: string): Promise<string> {
    try {
        const result = await summarizeData({ data, url });
        return result.summary;
    } catch (error) {
        console.error("Error getting summary:", error);
        return "Could not generate summary.";
    }
}
