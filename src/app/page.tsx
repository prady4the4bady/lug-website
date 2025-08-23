
"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Code, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThreeDMarquee, type MarqueeImage } from "@/components/ui/3d-marquee";
import { useAuth } from "@/hooks/use-auth";
import React from "react";
import { Draggable3DImageRing } from "@/components/ui/draggable-3d-image-ring";

const marqueeImages: MarqueeImage[] = [
    { src: '/images/1.png', alt: 'Linux', "data-ai-hint": "Linux mascot" },
    { src: '/images/2.png', alt: 'Open Source', "data-ai-hint": "open source code" },
    { src: '/images/3.png', alt: 'BITS Pilani', "data-ai-hint": "university building" },
    { src: '/images/4.png', alt: 'Dubai', "data-ai-hint": "Dubai skyline" },
    { src: '/images/5.png.png', alt: 'Technology', "data-ai-hint": "futuristic technology" },
    { src: '/images/6.png', alt: 'Community', "data-ai-hint": "diverse community" },
    { src: '/images/7.png', alt: 'Workshops', "data-ai-hint": "coding workshop" },
    { src: '/images/8.png', alt: 'Events', "data-ai-hint": "tech conference" },
]

export default function Home() {
  const { user, isAdmin, featureFlags } = useAuth();
  const showSignInButton = !user && (featureFlags?.showSignIn ?? true);
  const showMascot = featureFlags?.showMascot ?? true;

  const ringImages = marqueeImages.map(img => img.src);

  return (
    <div className="w-full relative overflow-hidden flex flex-col">

      {/* Section 1: Hero */}
      <section className="relative w-full min-h-[calc(100vh-6rem)] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full">
            <ThreeDMarquee images={marqueeImages} className="[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"/>
        </div>
        <div className="z-10 p-4">
          <div className="flex flex-col gap-6 items-center animate-fadeInUp">
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
        </div>
      </section>

      {/* Section 2: About Us */}
      <section className="relative w-full py-20 md:py-32 bg-background">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">About Us</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
             At LUG, we believe in the power of open-source technology and the freedom to create, share, and innovate. Our community brings together students passionate about Linux, open-source software, and collaborative development. From beginners to experts, we explore system administration, scripting, and cutting-edge tools through workshops, install fests, and discussions. At LUG, curiosity drives learning, collaboration fuels growth, and innovation thrives.
            </p>
        </div>
      </section>
      
      {/* Section 3: Draggable 3D Image Ring */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-background">
         <div className="absolute left-0 right-0 top-1/2 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]"></div>
        <Draggable3DImageRing 
            images={ringImages}
            width={400}
            imageDistance={600}
            draggable={false} // Disable dragging for continuous animation
            rotationSpeed={0.005} // Slow rotation speed
            rotationDirection="counter-clockwise" // "left to right" effect
        />
      </section>
      
    </div>
  );
}
