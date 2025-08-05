
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportBugSchema } from "@/lib/schemas";
import type { ReportBugValues } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { reportBug } from "@/ai/flows/report-bug-flow";

export default function ReportBugPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ReportBugValues>({
        resolver: zodResolver(reportBugSchema),
        defaultValues: {
            summary: "",
            description: "",
        },
    });

    const onSubmit: SubmitHandler<ReportBugValues> = async (data) => {
        if (!user) {
            toast({
                title: "Not Authenticated",
                description: "You must be signed in to report a bug.",
                variant: "destructive"
            });
            return router.push('/signin');
        }
        setIsSubmitting(true);
        try {
            await reportBug({
                summary: data.summary,
                description: data.description,
                user: {
                    id: user.uid,
                    email: user.email!,
                    name: user.displayName || 'Anonymous'
                }
            });

            toast({
                title: "Bug Report Submitted",
                description: "Thank you! Our team will look into it shortly.",
            });

            router.push('/');

        } catch (error) {
            console.error("Failed to submit bug report:", error);
            toast({
                title: "Submission Failed",
                description: "There was a problem submitting your report. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-12 md:py-20 flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Report a Bug</CardTitle>
                    <CardDescription>
                        Spotted an issue? Please let us know! Provide as much detail as possible.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="summary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Summary</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Profile page not loading" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the issue in detail. What were you doing? What did you expect to happen? What actually happened?"
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Report
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
