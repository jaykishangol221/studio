'use server';

/**
 * @fileOverview A flow that summarizes historical information based on user-provided keywords.
 *
 * - summarizeHistoricalInfo - A function that takes keywords as input and returns a concise summary.
 * - SummarizeHistoricalInfoInput - The input type for the summarizeHistoricalInfo function.
 * - SummarizeHistoricalInfoOutput - The return type for the summarizeHistoricalInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHistoricalInfoInputSchema = z.object({
  keywords: z.string().describe('Keywords related to the historical topic.'),
});
export type SummarizeHistoricalInfoInput = z.infer<typeof SummarizeHistoricalInfoInputSchema>;

const SummarizeHistoricalInfoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the historical information.'),
});
export type SummarizeHistoricalInfoOutput = z.infer<typeof SummarizeHistoricalInfoOutputSchema>;

export async function summarizeHistoricalInfo(input: SummarizeHistoricalInfoInput): Promise<SummarizeHistoricalInfoOutput> {
  return summarizeHistoricalInfoFlow(input);
}

const summarizeHistoricalInfoPrompt = ai.definePrompt({
  name: 'summarizeHistoricalInfoPrompt',
  input: {schema: SummarizeHistoricalInfoInputSchema},
  output: {schema: SummarizeHistoricalInfoOutputSchema},
  prompt: `You are an AI assistant specialized in providing concise summaries of historical topics.
  Based on the user-provided keywords, search the internet for relevant and up-to-date historical information.
  Then, generate a brief and informative summary of the topic.

  Keywords: {{{keywords}}}
  `,
});

const summarizeHistoricalInfoFlow = ai.defineFlow(
  {
    name: 'summarizeHistoricalInfoFlow',
    inputSchema: SummarizeHistoricalInfoInputSchema,
    outputSchema: SummarizeHistoricalInfoOutputSchema,
  },
  async input => {
    const {output} = await summarizeHistoricalInfoPrompt(input);
    return output!;
  }
);
