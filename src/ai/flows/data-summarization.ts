'use server';

/**
 * @fileOverview A data summarization AI agent.
 *
 * - summarizeData - A function that handles the data summarization process.
 * - SummarizeDataInput - The input type for the summarizeData function.
 * - SummarizeDataOutput - The return type for the summarizeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDataInputSchema = z.object({
  data: z
    .string()
    .describe('The scraped data to summarize.'),
  url: z.string().describe('The URL the data was scraped from.'),
});
export type SummarizeDataInput = z.infer<typeof SummarizeDataInputSchema>;

const SummarizeDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the scraped data.'),
});
export type SummarizeDataOutput = z.infer<typeof SummarizeDataOutputSchema>;

export async function summarizeData(input: SummarizeDataInput): Promise<SummarizeDataOutput> {
  return summarizeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDataPrompt',
  input: {schema: SummarizeDataInputSchema},
  output: {schema: SummarizeDataOutputSchema},
  prompt: `You are an expert data summarizer.  You will summarize the data scraped from the following URL.  The summarization should be concise and highlight the key insights.

URL: {{{url}}}
Data: {{{data}}}`,
});

const summarizeDataFlow = ai.defineFlow(
  {
    name: 'summarizeDataFlow',
    inputSchema: SummarizeDataInputSchema,
    outputSchema: SummarizeDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
