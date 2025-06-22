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
  selectors: z
    .array(z.string())
    .describe('An array of suggested CSS selectors for scraping.'),
});
export type SuggestSelectorsOutput = z.infer<typeof SuggestSelectorsOutputSchema>;

export async function suggestSelectors(input: SuggestSelectorsInput): Promise<SuggestSelectorsOutput> {
  return suggestSelectorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSelectorsPrompt',
  input: {schema: SuggestSelectorsInputSchema},
  output: {schema: SuggestSelectorsOutputSchema},
  prompt: `You are an expert web scraper. Given the URL and HTML content of a webpage, suggest CSS selectors that can be used to extract meaningful data from the page.

URL: {{{url}}}
Content:
{{{content}}}

Suggest at least 3 CSS selectors.

Return the selectors as a JSON array of strings.
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
