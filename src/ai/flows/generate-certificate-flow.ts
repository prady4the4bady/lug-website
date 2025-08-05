
'use server';
/**
 * @fileOverview A Genkit flow for generating event participation certificates.
 * This flow uses an image generation model to create a personalized certificate image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CertificateInputSchema = z.object({
  userName: z.string().describe('The name of the participant to be displayed on the certificate.'),
  eventTitle: z.string().describe('The title of the event.'),
  eventDate: z.string().describe('The date of the event.'),
});
export type CertificateInput = z.infer<typeof CertificateInputSchema>;

const CertificateOutputSchema = z.object({
  certificateDataUri: z.string().describe('The generated certificate image as a data URI.'),
});
export type CertificateOutput = z.infer<typeof CertificateOutputSchema>;

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: CertificateInputSchema,
    outputSchema: CertificateOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a certificate of participation. The certificate should have a professional and modern design suitable for a university tech club.
    
It must contain the following text elements:
- "Certificate of Participation" as the main title.
- "This certificate is proudly presented to"
- Attendee's Name: "${input.userName}"
- "For their active participation in the event"
- Event Name: "${input.eventTitle}"
- "Held on ${input.eventDate}"
- "Linux User Group - BITS Pilani Dubai Campus" as the issuing organization.
- Include a placeholder for a signature with the text "Faculty In-Charge" underneath it.

The design should incorporate the Linux Tux penguin mascot subtly and tastefully. The overall color scheme should be professional, using blues, greys, and perhaps a touch of gold or orange for accents. The layout must be landscape (16:9 aspect ratio).`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['IMAGE'],
        aspectRatio: '16:9',
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce a result.');
    }

    return { certificateDataUri: media.url };
  }
);

export async function generateCertificate(input: CertificateInput): Promise<CertificateOutput> {
  return generateCertificateFlow(input);
}
