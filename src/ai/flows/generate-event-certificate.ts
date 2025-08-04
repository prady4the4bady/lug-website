
'use server';
/**
 * @fileOverview A Genkit flow for generating event certificates.
 * 
 * - generateEventCertificate - A function that creates a certificate image.
 * - GenerateEventCertificateInput - The input type for the certificate generation.
 * - GenerateEventCertificateOutput - The return type for the certificate generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateEventCertificateInputSchema = z.object({
  eventName: z.string().describe('The name of the event for the certificate.'),
  userName: z.string().describe("The name of the user receiving the certificate."),
});
export type GenerateEventCertificateInput = z.infer<typeof GenerateEventCertificateInputSchema>;

export const GenerateEventCertificateOutputSchema = z.object({
  certificateDataUri: z.string().describe("The generated certificate as a base64 data URI."),
});
export type GenerateEventCertificateOutput = z.infer<typeof GenerateEventCertificateOutputSchema>;


export async function generateEventCertificate(input: GenerateEventCertificateInput): Promise<GenerateEventCertificateOutput> {
  return generateEventCertificateFlow(input);
}


const generateEventCertificateFlow = ai.defineFlow(
  {
    name: 'generateEventCertificateFlow',
    inputSchema: GenerateEventCertificateInputSchema,
    outputSchema: GenerateEventCertificateOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a certificate of participation for an event. The certificate should be formal and professional.
      
      Event Name: "${input.eventName}"
      Participant Name: "${input.userName}"
      
      The certificate should include the following text:
      "Certificate of Participation"
      "This certificate is proudly presented to"
      "${input.userName}"
      "For their active participation in the"
      "${input.eventName}"
      "Presented by the BITS Pilani Dubai Campus Linux User Group."
      
      The design should be clean, with a border, and include the Linux User Group logo (a stylized penguin, Tux) in a subtle way. Do not include any other text or dates.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce a data URI.');
    }

    return {
      certificateDataUri: media.url,
    };
  }
);
