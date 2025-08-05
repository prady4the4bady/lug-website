
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Target, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]"></div>
      </div>

      <div className="container py-12 md:py-20">
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">About LUG</h1>
          <p className="text-lg text-muted-foreground mt-2">Learn more about our community and what drives us.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="flex flex-col text-center bg-card/80 backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 animate-fadeInUp [animation-delay:200ms]">
            <CardHeader className="items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">Who We Are</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are a passionate group of students at BITS Pilani Dubai Campus, united by our interest in Linux, open-source software, and technology. Our community welcomes everyone, from beginners to experienced developers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col text-center bg-card/80 backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 animate-fadeInUp [animation-delay:300ms]">
            <CardHeader className="items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-full w-fit">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our mission is to foster a collaborative environment for learning and innovation. We aim to promote the use of open-source technologies and empower students with practical skills for their future careers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col text-center bg-card/80 backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 animate-fadeInUp [animation-delay:400ms]">
            <CardHeader className="items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-full w-fit">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">What We Do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We organize a variety of activities including workshops, coding sessions, tech talks by industry experts, and collaborative projects. We also maintain a forum for members to discuss, share knowledge, and seek help.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
