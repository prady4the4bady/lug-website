
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Code, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThreeDMarquee, type MarqueeImage } from "@/components/three-d-marquee";

const marqueeImages: MarqueeImage[] = [
    { src: 'https://placehold.co/400x300.png?text=Linux', alt: 'Linux' },
    { src: 'https://placehold.co/400x300.png?text=Open-Source', alt: 'Open Source' },
    { src: 'https://placehold.co/400x300.png?text=BITS+Pilani', alt: 'BITS Pilani' },
    { src: 'https://placehold.co/400x300.png?text=Dubai', alt: 'Dubai' },
    { src: 'https://placehold.co/400x300.png?text=Technology', alt: 'Technology' },
    { src: 'https://placehold.co/400x300.png?text=Community', alt: 'Community' },
    { src: 'https://placehold.co/400x300.png?text=Workshops', alt: 'Workshops' },
    { src: 'https://placehold.co/400x300.png?text=Events', alt: 'Events' },
]

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32 h-[80vh] overflow-hidden">
        <div className="absolute inset-0 -z-20 h-full w-full bg-background">
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full">
             <ThreeDMarquee images={marqueeImages} className="[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"/>
        </div>
        <div className="flex flex-col gap-6 items-start text-left animate-fadeInUp z-10">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Linux User Group
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md font-headline">
            Welcome to the home of open-source enthusiasts at <span className="text-primary/80 font-semibold">BITS Pilani Dubai Campus</span>.
          </p>
          <div className="pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-10 py-8" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center h-full animate-float z-10">
          <Image
            src="https://imagepng.org/wp-content/uploads/2017/06/pinguim-linux-tux.png"
            alt="Tux Penguin Mascot"
            width={400}
            height={400}
            className="object-contain transition-all duration-300 ease-in-out hover:[filter:drop-shadow(0_0_3rem_hsl(var(--primary)/0.5))]"
            data-ai-hint="Tux penguin"
            priority
          />
        </div>
      </section>

      <section className="relative py-20 pt-32">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 animate-fadeInUp">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12 animate-fadeInUp [animation-delay:100ms]">
                From hands-on workshops to expert talks, we provide a platform for learning, collaboration, and growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center bg-card/80 backdrop-blur animate-fadeInUp [animation-delay:200ms] transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2">
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
                <Card className="text-center bg-card/80 backdrop-blur animate-fadeInUp [animation-delay:300ms] transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2">
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
                <Card className="text-center bg-card/80 backdrop-blur animate-fadeInUp [animation-delay:400ms] transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2">
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
