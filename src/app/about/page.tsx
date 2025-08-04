import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Target, Rocket } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">About LUG</h1>
        <p className="text-lg text-muted-foreground mt-2">Learn more about our community and what drives us.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-md">
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
        
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-md">
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
        
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-md">
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
  )
}
