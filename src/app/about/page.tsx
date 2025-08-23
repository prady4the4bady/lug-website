
"use client";

import Carousel3D, { Carousel3DItem } from "@/components/carousel-3d";

export default function AboutPage() {
  const carouselItems: Carousel3DItem[] = [
    {
      id: 1,
      title: "Who We Are",
      brand: "Community",
      description: "At LUG, we believe in the power of open-source technology and the freedom to create, share, and innovate. Our community brings together students passionate about Linux, open-source software, and collaborative development. From beginners to experts, we explore system administration, scripting, and cutting-edge tools through workshops, install fests, and discussions. At LUG, curiosity drives learning, collaboration fuels growth, and innovation thrives.",
      tags: ["Open Source", "Collaboration", "Linux"],
      imageUrl: "/images/who.png",
      link: "https://www.linkedin.com/company/lugbpdc/posts/?feedView=all"
    },
    {
      id: 2,
      title: "Our Mission",
      brand: "Vision",
      description: "Our mission is to ignite a passion for open-source technology by fostering a collaborative environment for learning and innovation. We empower students with the practical skills and hands-on experience necessary to thrive in their future careers.",
      tags: ["Innovation", "Skills", "Technology"],
      imageUrl: "/images/mission.png",
      link: "https://www.linkedin.com/company/lugbpdc/posts/?feedView=all"
    },
    {
      id: 3,
      title: "What We Do",
      brand: "Activities",
      description: "From hands-on workshops and collaborative coding projects to expert-led tech talks and lively install fests, we offer a wide range of activities. Our community thrives on exploring everything from system administration to cutting-edge development, providing a space for members to share knowledge, seek guidance, and innovate together.",
      tags: ["Workshops", "Projects", "Talks"],
      imageUrl: "/images/what.png",
      link: "https://www.instagram.com/lugbpdc/"
    }
  ];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]"></div>
      </div>

      <div className="container py-12 md:py-20 flex flex-col items-center justify-center">
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">About LUG</h1>
          <p className="text-lg text-muted-foreground mt-2">Learn more about our community and what drives us.</p>
        </div>
        
        <Carousel3D items={carouselItems} rotateInterval={20000} />
      </div>
    </div>
  )
}
