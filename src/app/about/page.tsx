
import Image from "next/image";
import { Users, Target, Rocket } from "lucide-react";

export default function AboutPage() {
  const sections = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Who We Are",
      content: "We are a passionate group of students at BITS Pilani Dubai Campus, united by our interest in Linux, open-source software, and technology. Our community welcomes everyone, from beginners to experienced developers.",
      image: {
        src: "/images/who.png",
        alt: "A group of students collaborating in a workshop.",
        hint: "collaboration workshop"
      }
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Our Mission",
      content: "Our mission is to foster a collaborative environment for learning and innovation. We aim to promote the use of open-source technologies and empower students with practical skills for their future careers.",
       image: {
        src: "/images/mission.png",
        alt: "A person writing code on a laptop with stickers.",
        hint: "coding laptop"
      }
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "What We Do",
      content: "We organize a variety of activities including workshops, coding sessions, tech talks by industry experts, and collaborative projects. We also maintain a forum for members to discuss, share knowledge, and seek help.",
       image: {
        src: "/images/what.png",
        alt: "A speaker presenting at a tech conference.",
        hint: "tech conference"
      }
    }
  ];

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
        
        <div className="space-y-24">
          {sections.map((section, index) => (
            <div key={section.title} className="grid md:grid-cols-2 gap-12 items-center">
              <div className={`flex flex-col items-start gap-4 ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  {section.icon}
                </div>
                <h2 className="text-3xl font-headline font-bold">{section.title}</h2>
                <p className="text-muted-foreground text-lg">{section.content}</p>
              </div>
              <div className={`relative aspect-video rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 ${index % 2 !== 0 ? '' : 'md:order-last'}`}>
                  <Image src={section.image.src} alt={section.image.alt} fill className="object-cover" data-ai-hint={section.image.hint} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
