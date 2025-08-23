"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface MarqueeImage {
  src: string;
  alt: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  "data-ai-hint"?: string;
}

export interface ThreeDMarqueeProps {
  images: MarqueeImage[];
  className?: string;
  cols?: number;
  onImageClick?: (image: MarqueeImage, index: number) => void;
}

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images,
  className = "",
  cols = 4,
  onImageClick,
}) => {
  const isMobile = useIsMobile();
  const [numCols, setNumCols] = useState(cols);

  useEffect(() => {
    setNumCols(isMobile ? 2 : cols);
  }, [isMobile, cols]);

  if (!images || images.length === 0) {
    return null;
  }

  const groupSize = Math.ceil(images.length / numCols);
  const imageGroups = Array.from({ length: numCols }, (_, index) => {
    const start = index * groupSize;
    const end = start + groupSize;
    const groupImages = images.slice(start, end);
    // Duplicate the images within each group to ensure seamless looping
    return [...groupImages, ...groupImages];
  });
  

  const handleImageClick = (image: MarqueeImage, globalIndex: number) => {
    if (onImageClick) {
      onImageClick(image, globalIndex);
    } else if (image.href) {
      window.open(image.href, image.target || "_self");
    }
  };

  return (
    <section
      className={cn("mx-auto block h-[600px] max-sm:h-[400px] overflow-hidden", className)}
    >
      <div
        className="flex w-full h-full items-center justify-center"
        style={{
          transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg)",
        }}
      >
        <div className="w-full overflow-hidden scale-90 sm:scale-100">
          <div
            className={`relative grid h-full w-full origin-center grid-cols-2 sm:grid-cols-4 gap-4 transform`}
          >
            {imageGroups.map((imagesInGroup, idx) => (
              <motion.div
                key={`column-${idx}`}
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  duration: idx % 2 === 0 ? 25 : 35,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
                className="flex flex-col items-center gap-6"
              >
                {imagesInGroup.map((image, imgIdx) => {
                  const globalIndex = idx * groupSize + (imgIdx % (imagesInGroup.length / 2));
                  const isClickable = image.href || onImageClick;

                  return (
                    <div key={`img-${idx}-${imgIdx}`} className="relative">
                       <motion.img
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        src={image.src}
                        alt={image.alt}
                        width={200}
                        height={200}
                        className={`aspect-square w-full max-w-[200px] rounded-lg object-cover ring ring-gray-300/30 dark:ring-gray-800/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 ${
                          isClickable ? "cursor-pointer" : ""
                        }`}
                        onClick={() => handleImageClick(image, globalIndex)}
                        data-ai-hint={image['data-ai-hint']}
                      />
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
