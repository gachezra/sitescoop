'use server';

/**
 * @fileOverview A data cleaning AI agent for raw web content.
 *
 * - cleanData - A function that takes raw scraped data and cleans it based on its content type.
 * - CleanDataInput - The input type for the cleanData function.
 * - CleanDataOutput - The return type for the cleanData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CleanDataInputSchema = z.object({
  contentType: z.string().describe("The type of content being cleaned. Can be 'text', 'links', 'images', or 'tables'."),
  rawData: z
    .string()
    .describe('The raw scraped data as a string. This could be a block of text, a JSON array of URLs, etc.'),
});
export type CleanDataInput = z.infer<typeof CleanDataInputSchema>;

const CleanDataOutputSchema = z.object({
  cleanedData: z
    .string()
    .describe('The cleaned data as a string. Should be in the same basic format as the input (e.g., text, or a JSON array string for links/images/tables).'),
});
export type CleanDataOutput = z.infer<typeof CleanDataOutputSchema>;

export async function cleanData(input: CleanDataInput): Promise<CleanDataOutput> {
  return cleanDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cleanDataPrompt',
  input: {schema: CleanDataInputSchema},
  output: {schema: CleanDataOutputSchema},
  prompt: `You are an expert data cleaning specialist. You will be given a string of raw data scraped from a website. Your task is to clean it based on the provided content type.

**Content Type:** {{{contentType}}}

**Instructions:**
- **If contentType is 'text':**
  - Remove any leftover HTML artifacts.
  - Correct obvious typos and grammatical errors.
  - Improve formatting, paragraph breaks, and spacing for readability.
  - Remove irrelevant boilerplate text like navigation links, headers, or footers that got included.
  - Return the cleaned text as a single string.
- **If contentType is 'links':**
  - The input will be a JSON string array of URLs.
  - Remove any duplicates.
  - Remove any links that are not valid, absolute URLs (e.g., internal anchors like '#', or javascript calls).
  - Return a JSON string array of the cleaned, unique URLs.
- **If contentType is 'images':**
  - The input will be a JSON string array of image source URLs.
  - Remove any duplicates.
  - Remove any invalid URLs or placeholders (e.g., 1x1 pixel trackers, base64 encoded tiny images).
  - Return a JSON string array of the cleaned, unique image URLs.
- **If contentType is 'tables':**
  - The input is a JSON string representing an array of tables (string[][][]).
  - Clean the text within each cell (e.g., remove excess whitespace, fix typos).
  - Do NOT alter the structure (number of tables, rows, or columns).
  - Return a JSON string in the exact same string[][][] format.

Return the result as a string in the 'cleanedData' field.

**Input Data:**
\`\`\`
{{{rawData}}}
\`\`\`
`,
});

const cleanDataFlow = ai.defineFlow(
  {
    name: 'cleanDataFlow',
    inputSchema: CleanDataInputSchema,
    outputSchema: CleanDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
