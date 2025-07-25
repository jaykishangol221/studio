// src/ai/flows/identify-historical-date.ts
'use server';

/**
 * @fileOverview Identifies a relevant historical date based on user-provided keywords.
 *
 * - identifyHistoricalDate - A function that takes keywords and returns the most relevant date.
 * - IdentifyHistoricalDateInput - The input type for the identifyHistoricalDate function.
 * - IdentifyHistoricalDateOutput - The return type for the identifyHistoricalDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  prompt: `You are a historian. Given the following keywords related to a historical event, identify the single most relevant date associated with it. If you cannot identify a specific date, provide your best estimate. Also provide a short summary of the event.

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
