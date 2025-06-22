'use server';

/**
 * @fileOverview A data cleaning AI agent.
 *
 * - cleanData - A function that takes scraped data and cleans it.
 * - CleanDataInput - The input type for the cleanData function.
 * - CleanDataOutput - The return type for the cleanData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CleanDataInputSchema = z.object({
  data: z
    .string()
    .describe('The scraped data as a JSON string. It is an array of objects, each with title, description, link, etc.'),
});
export type CleanDataInput = z.infer<typeof CleanDataInputSchema>;

const CleanDataOutputSchema = z.object({
  cleanedData: z
    .string()
    .describe('The cleaned data as a JSON string, maintaining the original array and object structure.'),
});
export type CleanDataOutput = z.infer<typeof CleanDataOutputSchema>;

export async function cleanData(input: CleanDataInput): Promise<CleanDataOutput> {
  return cleanDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cleanDataPrompt',
  input: {schema: CleanDataInputSchema},
  output: {schema: CleanDataOutputSchema},
  prompt: `You are an expert data cleaning specialist. You will be given a JSON string of scraped data. Your task is to clean this data meticulously.

Cleaning tasks include:
- Remove any remaining HTML tags from text fields (title, description).
- Correct obvious typos and grammatical errors in the text.
- Standardize formatting. For example, ensure consistent spacing.
- Trim leading/trailing whitespace from all string values.
- Do NOT invent new data or remove items from the array. The structure and number of items in the output JSON must match the input JSON.
- If a date field exists, try to standardize it to a common format like YYYY-MM-DD, but only if you can do so with high confidence. Otherwise, leave it as is.

Return the result as a JSON string in the 'cleanedData' field.

Input Data:
{{{data}}}
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
