import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Code, Users } from "lucide-react";
import Link from "next/link";

function Tux3DModel() {
  return (
    <div className="relative w-full max-w-md h-96 mx-auto lg:mx-0">
      <iframe 
        title="Tux" 
        frameBorder="0" 
        allowFullScreen 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        src="https://sketchfab.com/models/157de95fa4014050a969a8361a83d366/embed?autostart=1&ui_hint=0&camera=0"
        className="w-full h-full rounded-lg"
      >
      </iframe>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full">
      <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
        <div className="flex flex-col gap-6 items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
            Linux User Group
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 font-headline">
            BITS Pilani Dubai Campus
          </p>
          <p className="text-base text-foreground/80 max-w-lg mx-auto lg:mx-0">
            A community of open-source enthusiasts, developers, and innovators. Explore the world of Linux and FOSS with us.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6" asChild>
            <Link href="/signin">Get Started</Link>
          </Button>
        </div>
        <Tux3DModel />
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
