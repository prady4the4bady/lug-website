
'use server';
/**
 * @fileOverview A bug reporting flow that analyzes a user's report,
 * categorizes it, and saves it to Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ReportBugInputSchema = z.object({
  summary: z.string().describe('A brief summary of the bug report.'),
  description: z.string().describe('A detailed description of the bug.'),
  category: z.enum(['UI/UX', 'Backend', 'Feature Request', 'Other']).describe("The user-selected category of the bug report."),
  user: z.object({
    id: z.string().describe('The ID of the user reporting the bug.'),
    email: z.string().describe('The email of the user.'),
    name: z.string().describe('The name of the user.'),
  }),
});
export type ReportBugInput = z.infer<typeof ReportBugInputSchema>;

const ReportBugOutputSchema = z.object({
  reportId: z.string().describe('The ID of the newly created bug report document in Firestore.'),
});
export type ReportBugOutput = z.infer<typeof ReportBugOutputSchema>;


const reportBugFlow = ai.defineFlow(
  {
    name: 'reportBugFlow',
    inputSchema: ReportBugInputSchema,
    outputSchema: ReportBugOutputSchema,
  },
  async (input) => {
    const newReportRef = doc(collection(db, 'reports'));
    
    const newReport = {
      id: newReportRef.id,
      summary: input.summary,
      description: input.description,
      userId: input.user.id,
      userEmail: input.user.email,
      userName: input.user.name,
      createdAt: serverTimestamp(),
      category: input.category,
      status: 'New',
    };

    await setDoc(newReportRef, newReport);

    return { reportId: newReportRef.id };
  }
);

export async function reportBug(input: ReportBugInput): Promise<ReportBugOutput> {
  return reportBugFlow(input);
}
