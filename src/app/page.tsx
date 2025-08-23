
"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Code, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThreeDMarquee, type MarqueeImage } from "@/components/three-d-marquee";
import { useAuth } from "@/hooks/use-auth";
import { ImageCycler3D } from "@/components/image-cycler-3d";

const marqueeImages: MarqueeImage[] = [
    { src: '/images/1.png', alt: 'Linux', "data-ai-hint": "Linux mascot" },
    { src: '/images/2.png', alt: 'Open Source', "data-ai-hint": "open source code" },
    { src: '/images/3.png', alt: 'BITS Pilani', "data-ai-hint": "university building" },
    { src: '/images/4.png', alt: 'Dubai', "data-ai-hint": "Dubai skyline" },
    { src: '/images/5.png', alt: 'Technology', "data-ai-hint": "futuristic technology" },
    { src: '/images/6.png', alt: 'Community', "data-ai-hint": "diverse community" },
    { src: '/images/7.png', alt: 'Workshops', "data-ai-hint": "coding workshop" },
    { src: '/images/8.png', alt: 'Events', "data-ai-hint": "tech conference" },
]

const carouselImages = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
];

export default function Home() {
  const { featureFlags } = useAuth();
  const showSignInButton = featureFlags?.showSignIn ?? true;
  const showMascot = featureFlags?.showMascot ?? true;

  return (
    <div className="w-full relative overflow-hidden">
       <div className="absolute inset-0 -z-20 h-full w-full bg-background">
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full">
            <ThreeDMarquee images={marqueeImages} className="[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"/>
      </div>
      
      <section className="relative container grid lg:grid-cols-2 gap-12 items-center justify-items-center lg:justify-items-start py-20 md:py-32 min-h-[calc(100vh-6rem)]">
        <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left animate-fadeInUp z-10">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Linux User Group BPDC
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md font-headline">
            Welcome to the home of open-source enthusiasts at <span className="text-primary/80 font-semibold">BITS Pilani Dubai Campus</span>.
          </p>
          {showSignInButton && (
            <div className="pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-10 py-8" asChild>
                <Link href="/signin">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
        {showMascot && (
          <div className="relative flex items-center justify-center h-full w-full max-w-md animate-float z-10">
            <Image
              src="https://imagepng.org/wp-content/uploads/2017/06/pinguim-linux-tux.png"
              alt="Tux Penguin Mascot"
              width={400}
              height={400}
              style={{ height: "auto" }}
              className="object-contain transition-all duration-300 ease-in-out hover:[filter:drop-shadow(0_0_3rem_hsl(var(--primary)/0.5))]"
              data-ai-hint="Tux penguin"
              priority
            />
          </div>
        )}
      </section>
      
      <section className="relative py-20 pt-32 h-[600px]">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background/80 backdrop-blur-sm"></div>
        <div className="container text-center h-full">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 animate-fadeInUp">What We Do</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12 animate-fadeInUp [animation-delay:100ms]">
                Explore our activities through this interactive 3D carousel.
            </p>
            <ImageCycler3D images={carouselImages} />
        </div>
      </section>
    </div>
  );
}
