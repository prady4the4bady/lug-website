
"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Code, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThreeDMarquee, type MarqueeImage } from "@/components/ui/3d-marquee";
import { useAuth } from "@/hooks/use-auth";
import React from "react";
import { Draggable3DImageRing } from "@/components/ui/draggable-3d-image-ring";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


const marqueeImages: MarqueeImage[] = [
    { src: '/images/1.png', alt: 'Linux', "data-ai-hint": "Linux mascot" },
    { src: '/images/2.png', alt: 'Open Source', "data-ai-hint": "open source code" },
    { src: '/images/3.png', alt: 'BITS Pilani', "data-ai-hint": "university building" },
    { src: '/images/4.png', alt: 'Dubai', "data-ai-hint": "Dubai skyline" },
    { src: '/images/5.png', alt: 'Technology', "data-ai-hint": "futuristic technology" },
    { src: '/images/6.png', alt: 'Community', "data-ai-hint": "diverse community" },
    { src: '/images/7.png', alt: 'Workshops', "data-ai-hint": "coding workshop" },
    { src: '/images/8.png', alt: 'Events', "data-ai-hint": "tech conference" },
    { src: '/images/1.png', alt: 'Linux', "data-ai-hint": "Linux mascot" },
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
          {/* Glowing Orange Card Container */}
          <div className="relative group">
            {/* Orange Glow Background */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-lug-orange/20 via-lug-orange/30 to-lug-orange/20 opacity-75 blur-2xl group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
            <div className="absolute -inset-4 rounded-2xl bg-lug-orange/10 opacity-50 blur-xl"></div>
            
            {/* Glassmorphic Card */}
            <div className="relative backdrop-blur-md bg-card/40 border border-lug-orange/20 rounded-2xl p-8 md:p-12 shadow-2xl shadow-lug-orange/25">
              <div className="flex flex-col gap-6 items-center animate-fadeInUp">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Linux User Group
                  </h1>
                  {/* Orange accent line */}
                  <div className="w-32 h-1 bg-gradient-to-r from-lug-orange via-lug-orange/80 to-lug-orange mx-auto rounded-full shadow-lg shadow-lug-orange/50"></div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-lg md:text-xl text-muted-foreground font-headline">
                    Welcome to the home of open-source enthusiasts
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg md:text-xl text-muted-foreground font-headline">at</span>
                    <span className="text-lg md:text-xl text-lug-orange font-semibold font-headline">BITS Pilani Dubai Campus</span>
                  </div>
                  {/* Orange accent line */}
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-lug-orange to-transparent mx-auto rounded-full"></div>
                </div>
                
                {showSignInButton && (
                  <div className="pt-6">
                    <Button size="lg" className="bg-lug-orange hover:bg-lug-orange/90 text-white font-bold text-xl px-10 py-8 shadow-xl shadow-lug-orange/30 hover:shadow-2xl hover:shadow-lug-orange/40 transition-all duration-300" asChild>
                      <Link href="/signin">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: About Us */}
      <section className="relative w-full py-20 md:py-32 bg-background">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="container mx-auto flex justify-center relative">
            <div className="absolute -inset-8 -z-10 rounded-full bg-lug-orange/10 blur-3xl opacity-30"></div>
            <Card className="w-full max-w-4xl text-center bg-card/80 backdrop-blur-sm border-lug-orange/10">
                <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl font-headline font-bold">About Us</CardTitle>
                    <div className="w-24 h-1 bg-gradient-to-r from-lug-orange via-lug-orange/80 to-lug-orange mx-auto mt-2 mb-4 rounded-full shadow-lg shadow-lug-orange/30"></div>
                </CardHeader>
                <CardContent>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                     At LUG, we believe in the power of open-source technology and the freedom to create, share, and innovate. Our community brings together students passionate about Linux, open-source software, and collaborative development. From beginners to experts, we explore system administration, scripting, and cutting-edge tools through workshops, install fests, and discussions. At LUG, curiosity drives learning, collaboration fuels growth, and innovation thrives.
                    </p>
                </CardContent>
            </Card>
        </div>
      </section>
      
      {/* Section 3: Draggable 3D Image Ring */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-background">
         <div className="absolute left-0 right-0 top-1/2 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-lug-orange/10 blur-[100px]"></div>
        <Draggable3DImageRing 
            images={ringImages}
            width={400}
            imageDistance={600}
            draggable={true} 
            rotationSpeed={0.005}
            rotationDirection="counter-clockwise"
            mobileScaleFactor={0.75}
        />
      </section>
      
    </div>
  );
}
