
'use server';

import { suggestSelectors } from '@/ai/flows/ai-selector-suggestions';
import { summarizeData } from '@/ai/flows/data-summarization';

export async function getScrapingSuggestions(url: string): Promise<string[]> {
  try {
    // In a real application, you would fetch the URL's content.
    // For this demo, we'll use mock HTML content.
    const mockHtmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Mock E-commerce</title>
      </head>
      <body>
        <div class="product-list">
          <div class="product-item">
            <img src="https://placehold.co/200x200.png" alt="Product 1" class="product-image">
            <h2 class="product-title">Smartwatch</h2>
            <p class="product-price">$199.99</p>
            <span class="product-rating">4.5</span>
          </div>
          <div class="product-item">
            <img src="https://placehold.co/200x200.png" alt="Product 2" class="product-image">
            <h2 class="product-title">Wireless Headphones</h2>
            <p class="product-price">$89.99</p>
            <span class="product-rating">4.8</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await suggestSelectors({ url, content: mockHtmlContent });
    return result.selectors;
  } catch (error) {
    console.error("Error getting selector suggestions:", error);
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
