'use server';

/**
 * @fileOverview Certificate generation flow.
 *
 * - generateEventCertificate - A function that generates a certificate with user and event information.
 * - GenerateEventCertificateInput - The input type for the generateEventCertificate function.
 * - GenerateEventCertificateOutput - The return type for the generateEventCertificate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventCertificateInputSchema = z.object({
  userName: z.string().describe('The full name of the user.'),
  eventName: z.string().describe('The name of the event attended.'),
  eventDate: z.string().describe('The date of the event.'),
  certificateTemplate: z
    .string()
    .describe(
      'The certificate template as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateEventCertificateInput = z.infer<typeof GenerateEventCertificateInputSchema>;

const GenerateEventCertificateOutputSchema = z.object({
  certificateDataUri: z
    .string()
    .describe(
      'The generated certificate as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:image/png;base64,<encoded_data>\'.'
    ),
});
export type GenerateEventCertificateOutput = z.infer<typeof GenerateEventCertificateOutputSchema>;

export async function generateEventCertificate(
  input: GenerateEventCertificateInput
): Promise<GenerateEventCertificateOutput> {
  return generateEventCertificateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventCertificatePrompt',
  input: {schema: GenerateEventCertificateInputSchema},
  output: {schema: GenerateEventCertificateOutputSchema},
  prompt: `You are an expert certificate designer.

You will take the provided SVG certificate template and fill in the user's name, event name, and event date in the designated placeholder fields (USER_NAME_HERE, EVENT_NAME_HERE, EVENT_DATE_HERE).

Replace the placeholder text in the SVG with the provided information. Do not change the styling or layout of the SVG.

Return the modified certificate as a PNG image, encoded as a data URI.

User Name: {{{userName}}}
Event Name: {{{eventName}}}
Event Date: {{{eventDate}}}
Certificate Template: {{media url=certificateTemplate}}

The output must be a valid PNG data URI.
`,
});

const generateEventCertificateFlow = ai.defineFlow(
  {
    name: 'generateEventCertificateFlow',
    inputSchema: GenerateEventCertificateInputSchema,
    outputSchema: GenerateEventCertificateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
