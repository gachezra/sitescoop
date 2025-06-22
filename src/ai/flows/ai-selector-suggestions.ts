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
  container: z.string().min(1, { message: "Container selector cannot be empty." }).describe('The CSS selector for the main container of a single item in a list.'),
  title: z.string().min(1, { message: "Title selector cannot be empty." }).describe('The CSS selector for the item title, relative to the container.'),
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
  prompt: `You are an expert web scraper. Your task is to analyze the provided HTML content and suggest robust CSS selectors to extract a list of items.

**Instructions:**
1.  **Identify the repeating container:** Find the most reliable CSS selector for a container element that encapsulates each individual item in a list.
2.  **Find relative selectors:** Within that container, find the specific selectors for the following data points. These selectors MUST be relative to the container.
    *   \`title\`: The main title or heading of the item. This is the most important field.
    *   \`description\`: A short summary or description of the item.
    *   \`link\`: The URL to the item's detail page. Extract the 'href' attribute.
    *   \`imageUrl\`: The URL for an image representing the item. Extract the 'src' or 'data-src' attribute.
    *   \`date\`: The publication or event date, if available.
3.  **Validation:** Double-check your selectors against the HTML to ensure they are correct and will extract data. Be very careful. An incorrect selector for the title will cause the entire scrape to fail.
4.  **Output:** Return a JSON object with keys "container", "title", "description", "link", "imageUrl", and "date". If a field (like date or description) is not present, you can return an empty string for its selector, but the \`container\` and \`title\` selectors must be present and accurate.

URL: {{{url}}}
HTML Content:
\`\`\`html
{{{content}}}
\`\`\`
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
