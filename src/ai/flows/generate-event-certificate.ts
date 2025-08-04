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
      'The certificate template as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
});
export type GenerateEventCertificateInput = z.infer<typeof GenerateEventCertificateInputSchema>;

const GenerateEventCertificateOutputSchema = z.object({
  certificateDataUri: z
    .string()
    .describe(
      'The generated certificate as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
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
  prompt: `You are an expert certificate generator.

You will take the provided certificate template and fill in the user's name, event name, and event date.

Return the generated certificate as a data URI with base64 encoding.

User Name: {{{userName}}}
Event Name: {{{eventName}}}
Event Date: {{{eventDate}}}
Certificate Template: {{media url=certificateTemplate}}

Ensure that the generated certificate is a valid PDF format.
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
