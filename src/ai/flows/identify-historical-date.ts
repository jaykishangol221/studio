// src/ai/flows/identify-historical-date.ts
'use server';

/**
 * @fileOverview Identifies a relevant historical date and provides a summary based on user-provided keywords.
 *
 * - identifyHistoricalDate - A function that takes keywords and returns the most relevant date and a summary.
 * - IdentifyHistoricalDateInput - The input type for the identifyHistoricalDate function.
 * - IdentifyHistoricalDateOutput - The return type for the identifyHistoricalDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const IdentifyHistoricalDateInputSchema = z.object({
  keywords: z.string().describe('Keywords related to the historical event.'),
});
export type IdentifyHistoricalDateInput = z.infer<typeof IdentifyHistoricalDateInputSchema>;

const IdentifyHistoricalDateOutputSchema = z.object({
  date: z.string().describe('The most relevant date associated with the keywords.'),
  summary: z.string().optional().describe('A brief summary of the event.').default('')
});
export type IdentifyHistoricalDateOutput = z.infer<typeof IdentifyHistoricalDateOutputSchema>;

export async function identifyHistoricalDate(input: IdentifyHistoricalDateInput): Promise<IdentifyHistoricalDateOutput> {
  return identifyHistoricalDateFlow(input);
}

const identifyHistoricalDatePrompt = ai.definePrompt({
  name: 'identifyHistoricalDatePrompt',
  input: {schema: IdentifyHistoricalDateInputSchema},
  output: {schema: IdentifyHistoricalDateOutputSchema},
  tools: [googleAI.search],
  model: googleAI('gemini-2.0-flash'),
  prompt: `You are a historian. Given the following keywords related to a historical event, use your knowledge and perform a web search to identify the single most relevant date associated with it. 
  
Also provide an accurate and concise summary of the event.

Keywords: {{{keywords}}}

Return the date and summary in JSON format.`,
});

const identifyHistoricalDateFlow = ai.defineFlow(
  {
    name: 'identifyHistoricalDateFlow',
    inputSchema: IdentifyHistoricalDateInputSchema,
    outputSchema: IdentifyHistoricalDateOutputSchema,
  },
  async input => {
    const {output} = await identifyHistoricalDatePrompt(input);
    return output!;
  }
);
