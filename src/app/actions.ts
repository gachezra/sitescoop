'use server';

import { cleanData } from '@/ai/flows/data-cleaning';
import * as cheerio from 'cheerio';
import { z } from 'zod';

export type ContentType = 'text' | 'links' | 'images' | 'tables';

export type ScrapedData = {
    contentType: ContentType,
    data: any;
    url: string;
};

export async function extractContent(url: string, contentType: ContentType): Promise<{
    data?: ScrapedData;
    error?: string;
}> {
    if (!url || !contentType) {
        return { error: 'URL and content type are required.' };
    }

    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        if (!response.ok) {
            console.error(`Error fetching URL: ${response.statusText}`);
            return { error: `Failed to fetch the URL. Status: ${response.statusText}` };
        }
        const htmlContent = await response.text();
        const $ = cheerio.load(htmlContent);

        let extractedData: any;

        switch (contentType) {
            case 'text':
                // Remove script and style tags to avoid extracting their content
                $('script, style').remove();
                extractedData = $('body').text().replace(/\s\s+/g, ' ').trim();
                break;
            case 'links':
                extractedData = Array.from(new Set($('a').map((i, el) => $(el).attr('href')).get()
                    .map(href => href ? new URL(href, url).href : '')
                    .filter(href => href && (href.startsWith('http://') || href.startsWith('https://')))));
                break;
            case 'images':
                 extractedData = Array.from(new Set($('img').map((i, el) => $(el).attr('src')).get()
                    .map(src => src ? new URL(src, url).href : '')
                    .filter(src => src && (src.startsWith('http://') || src.startsWith('https://')))));
                break;
            case 'tables':
                const tablesData: string[][][] = [];
                $('table').each((i, tableElem) => {
                    const table: string[][] = [];
                    $(tableElem).find('tr').each((j, rowElem) => {
                        const row: string[] = [];
                        $(rowElem).find('th, td').each((k, cellElem) => {
                            row.push($(cellElem).text().trim());
                        });
                        if (row.length > 0) {
                            table.push(row);
                        }
                    });
                    if (table.length > 0) {
                        tablesData.push(table);
                    }
                });
                extractedData = tablesData;
                break;
            default:
                return { error: 'Invalid content type specified.' };
        }

        if (!extractedData || (Array.isArray(extractedData) && extractedData.length === 0)) {
            return { error: `No '${contentType}' content could be extracted from the page.` };
        }

        return { data: { contentType, data: extractedData, url } };

    } catch (error) {
        console.error("Error performing content extraction:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred during extraction.";
        return { error: message };
    }
}


export async function performDataCleaning(scrapedData: ScrapedData): Promise<{
    cleanedData?: any;
    error?: string;
}> {
    if (!scrapedData || !scrapedData.data) {
        return { error: "No data provided to clean." };
    }
    try {
        const rawDataString = typeof scrapedData.data === 'string' ? scrapedData.data : JSON.stringify(scrapedData.data);
        
        const result = await cleanData({ 
            contentType: scrapedData.contentType, 
            rawData: rawDataString,
        });
        
        if (!result.cleanedData) {
            return { error: "AI cleaning failed to return data." };
        }
        
        // If the original data was an array, try to parse the cleaned data back into an array
        if (Array.isArray(scrapedData.data)) {
            try {
                // The AI might return a stringified JSON array
                return { cleanedData: JSON.parse(result.cleanedData) };
            } catch (e) {
                // Or it might return a newline-separated list
                return { cleanedData: result.cleanedData.split('\n').filter(i => i.trim() !== '') };
            }
        }

        return { cleanedData: result.cleanedData };

    } catch (error) {
        console.error("Error performing data cleaning:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred during cleaning.";
        return { error: message };
    }
}
