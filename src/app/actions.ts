'use server';

import { suggestSelectors } from '@/ai/flows/ai-selector-suggestions';
import { summarizeData } from '@/ai/flows/data-summarization';
import type { Product } from '@/types';
import * as cheerio from 'cheerio';

export async function performScrape(url: string): Promise<{
    data?: Product[];
    summary?: string;
    error?: string;
}> {
    try {
        // Step 1: Fetch the page content.
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        if (!response.ok) {
            console.error(`Error fetching URL: ${response.statusText}`);
            return { error: `Failed to fetch the URL. Status: ${response.statusText}` };
        }
        const htmlContent = await response.text();

        // Step 2: Get AI-suggested selectors based on the content.
        const selectors = await suggestSelectors({ url, content: htmlContent });
        if (!selectors || !selectors.container) {
            return { error: "The AI could not identify a clear structure to scrape on this page. Please try a different URL with a list-like format." };
        }

        // Step 3: Scrape the data using the AI-suggested selectors.
        const $ = cheerio.load(htmlContent);
        const scrapedProducts: Product[] = [];
        
        $(selectors.container).each((index, element) => {
          const title = $(element).find(selectors.title).text().trim();
          const description = $(element).find(selectors.description).text().trim();
          const date = selectors.date ? $(element).find(selectors.date).text().trim() : undefined;
          
          let link = $(element).find(selectors.link).attr('href') || '';
          if (link) {
            try {
              link = new URL(link, url).href;
            } catch (e) {
                console.warn(`Invalid link URL found: ${link}`);
                link = '#';
            }
          }

          let imageUrl = $(element).find(selectors.imageUrl).attr('src') || $(element).find(selectors.imageUrl).attr('data-src') || '';
          if (imageUrl) {
            try {
                imageUrl = new URL(imageUrl, url).href;
            } catch (e) {
                console.warn(`Invalid image URL found: ${imageUrl}`);
                imageUrl = `https://placehold.co/100x100.png`;
            }
          }

          if (title) {
            scrapedProducts.push({
                id: `${index}-${title}`,
                title,
                description,
                link,
                imageUrl: imageUrl || `https://placehold.co/100x100.png`,
                date
            });
          }
        });

        if (scrapedProducts.length === 0) {
            return { error: "The AI identified a structure, but no data could be extracted. The website might be using JavaScript to load content, or the structure is too complex." };
        }
    
        // Step 4: Summarize the extracted data.
        const summaryResult = await summarizeData({ data: JSON.stringify(scrapedProducts.slice(0, 5)), url });
        const summary = summaryResult.summary;

        return { data: scrapedProducts, summary };

    } catch (error) {
        console.error("Error performing scrape:", error);
        return { error: "An unexpected error occurred. Please check the console for details." };
    }
}
