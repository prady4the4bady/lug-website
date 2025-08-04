
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Code, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
        <div className="flex flex-col gap-6 items-start text-left">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
            Linux User Group
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md font-headline">
            BITS Pilani Dubai Campus
          </p>
          <div className="pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://stablediffusion-prod.s3.amazonaws.com/4dd4195a-2736-4995-9344-93515437e2a9.png"
            alt="Tux Penguin Mascot"
            className="w-full max-w-md h-auto transition-all duration-300 ease-in-out hover:[filter:drop-shadow(0_0_2rem_hsl(var(--primary)/0.4))]"
            data-ai-hint="Tux penguin"
          />
        </div>
      </section>

      <section className="bg-muted/30 dark:bg-card/20 py-20">
        <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                From hands-on workshops to expert talks, we provide a platform for learning, collaboration, and growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center bg-card/80 backdrop-blur">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Workshops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Practical sessions on Linux, programming, and more.</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-card/80 backdrop-blur">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <Code className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Guest Lectures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Insights from industry experts on cutting-edge tech.</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-card/80 backdrop-blur">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <Rocket className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Community Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Collaborate on real-world open-source projects.</p>
                  </CardContent>
                </Card>
            </div>
        </div>
      </section>
    </div>
  );
}
