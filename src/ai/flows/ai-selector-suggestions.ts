'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting CSS selectors for web scraping.
 *
 * - suggestSelectors - A function that takes a URL and content, and returns suggested CSS selectors.
 * - SuggestSelectorsInput - The input type for the suggestSelectors function.
 * - SuggestSelectorsOutput - The return type for the suggestSelectors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSelectorsInputSchema = z.object({
  url: z.string().describe('The URL of the webpage to scrape.'),
  content: z.string().describe('The HTML content of the webpage.'),
});
export type SuggestSelectorsInput = z.infer<typeof SuggestSelectorsInputSchema>;

const SuggestSelectorsOutputSchema = z.object({
  container: z.string().describe('The CSS selector for the main container of a single item in the list.'),
  name: z.string().describe('The CSS selector for the product name, relative to the container.'),
  price: z.string().describe('The CSS selector for the product price, relative to the container.'),
  rating: z.string().describe('The CSS selector for the product rating, relative to the container.'),
  imageUrl: z.string().describe('The CSS selector for the product image, relative to the container.'),
});
export type SuggestSelectorsOutput = z.infer<typeof SuggestSelectorsOutputSchema>;

export async function suggestSelectors(input: SuggestSelectorsInput): Promise<SuggestSelectorsOutput> {
  return suggestSelectorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSelectorsPrompt',
  input: {schema: SuggestSelectorsInputSchema},
  output: {schema: SuggestSelectorsOutputSchema},
  prompt: `You are an expert web scraper. Given the URL and HTML content of a webpage, suggest CSS selectors to extract product information.

Identify a repeating container element for each product. Then, within that container, find the selectors for the name, price, rating, and image URL.

URL: {{{url}}}
Content:
{{{content}}}

Return the selectors as a JSON object with keys "container", "name", "price", "rating", and "imageUrl". The selectors for name, price, rating and imageUrl should be relative to the container.
`,
});

const suggestSelectorsFlow = ai.defineFlow(
  {
    name: 'suggestSelectorsFlow',
    inputSchema: SuggestSelectorsInputSchema,
    outputSchema: SuggestSelectorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
