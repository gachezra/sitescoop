'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting CSS selectors for web scraping.
 *
 * - suggestSelectors - A function that takes a URL and content, and returns suggested CSS selectors.
 * - SuggestSelectorsInput - The input type for the suggestSelectors function.
 * - SuggestSelectorsOutput - The return type for the suggestSelectors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestSelectorsInputSchema = z.object({
  url: z.string().describe('The URL of the webpage to scrape.'),
  content: z.string().describe('The HTML content of the webpage.'),
});
export type SuggestSelectorsInput = z.infer<typeof SuggestSelectorsInputSchema>;

const SuggestSelectorsOutputSchema = z.object({
  container: z.string().describe('The CSS selector for the main container of a single item in a list.'),
  title: z.string().describe('The CSS selector for the item title, relative to the container.'),
  description: z.string().describe('The CSS selector for the item description, relative to the container.'),
  link: z.string().describe("The CSS selector for the link to the item's detail page, relative to the container."),
  imageUrl: z.string().describe('The CSS selector for the item image, relative to the container.'),
  date: z.string().optional().describe('The CSS selector for the item date, relative to the container.'),
});
export type SuggestSelectorsOutput = z.infer<typeof SuggestSelectorsOutputSchema>;

export async function suggestSelectors(input: SuggestSelectorsInput): Promise<SuggestSelectorsOutput> {
  return suggestSelectorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSelectorsPrompt',
  input: {schema: SuggestSelectorsInputSchema},
  output: {schema: SuggestSelectorsOutputSchema},
  prompt: `You are an expert web scraper. Given the URL and HTML content of a webpage, suggest CSS selectors to extract a list of items.

Identify a repeating container element for each item. Then, within that container, find the selectors for the title, a description, a link to the item's page, an image URL, and a date if available.

URL: {{{url}}}
Content:
{{{content}}}

Return the selectors as a JSON object with keys "container", "title", "description", "link", "imageUrl", and "date". The selectors for title, description, link, imageUrl, and date should be relative to the container.
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
