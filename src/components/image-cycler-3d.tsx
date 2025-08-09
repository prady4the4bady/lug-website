
"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  easeOut,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface Draggable3DImageRingProps {
  images?: string[];
  imageWidth?: number;
  imageHeight?: number;
  isDraggable?: boolean;
  dragSpeed?: number;
  rotationSpeed?: number;
  showBlur?: boolean;
  showShadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowBlur?: number;
  blurAmount?: number;
  initialRotation?: number;
  rotationDirection?: "clockwise" | "counter-clockwise";
  scale?: number;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
  onImageClick?: (index: number, image: string) => void;
}

export const ImageCycler3D: React.FC<Draggable3DImageRingProps> = ({
  images = [],
  imageWidth = 120,
  imageHeight = 120,
  isDraggable = true,
  dragSpeed = 0.05,
  rotationSpeed = 0.02,
  showBlur = true,
  showShadow = true,
  shadowColor = "rgba(0,0,0,0.5)",
  shadowOpacity = 0.5,
  shadowBlur = 10,
  blurAmount = 2,
  initialRotation = 0,
  rotationDirection = "clockwise",
  scale = 1,
  autoPlay = true,
  interval = 5000,
  className,
  style,
  onImageClick,
}) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const radius = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
        ? window.innerWidth * 0.4
        : window.innerWidth * 0.2;
    }
    return 200; // Default radius
  }, [windowWidth]);

  const rotation = useMotionValue(initialRotation);
  const dragStartRef = useRef<{ x: number; rotation: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const N = images.length;
  const angle = 2 * Math.PI / N;

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggable) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = {
      x: clientX,
      rotation: rotation.get(),
    };
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current || !isDraggable) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartRef.current.x;
    const newRotation =
      dragStartRef.current.rotation + deltaX * dragSpeed;
    rotation.set(newRotation);
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
    const currentRotation = rotation.get();
    const closestIndex = Math.round(currentRotation / angle);
    const targetRotation = closestIndex * angle;
    animate(rotation, targetRotation, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      ease: easeOut,
    });
  };

  useEffect(() => {
    const animation = () => {
      const currentRotation = rotation.get();
      const direction = rotationDirection === "clockwise" ? 1 : -1;
      rotation.set(currentRotation + rotationSpeed * direction);
      requestAnimationFrame(animation);
    };

    if (!isDraggable && !autoPlay) {
      const frameId = requestAnimationFrame(animation);
      return () => cancelAnimationFrame(frameId);
    }
  }, [rotation, rotationSpeed, rotationDirection, isDraggable, autoPlay]);

  useEffect(() => {
    if (autoPlay) {
      const playInterval = setInterval(() => {
        setActiveIndex((prev) => {
          const newIndex = (prev + 1) % N;
          const targetRotation = -newIndex * angle;
          animate(rotation, targetRotation, {
            type: "spring",
            stiffness: 100,
            damping: 20,
          });
          return newIndex;
        });
      }, interval);
      return () => clearInterval(playInterval);
    }
  }, [autoPlay, N, angle, interval, rotation]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full h-full",
        className
      )}
      style={style}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      onTouchEnd={handleDragEnd}
    >
      <AnimatePresence>
        {images.map((image, i) => {
          const rotateY = rotation.get() + i * angle;
          const zIndex = Math.floor(N / 2) - Math.abs(i - (Math.round(-rotation.get() / angle) % N));
          const currentScale = scale * (1 + Math.sin(rotateY) * 0.1);

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotateY}rad) translateZ(${radius}px) scale(${currentScale})`,
                zIndex,
              }}
              onClick={() => onImageClick?.(i, image)}
            >
              <img
                src={image}
                alt={`Image ${i + 1}`}
                className="object-cover rounded-lg"
                style={{
                  width: `${imageWidth}px`,
                  height: `${imageHeight}px`,
                  filter: showBlur
                    ? `blur(${blurAmount * Math.abs(Math.sin(rotateY))}px)`
                    : "none",
                  boxShadow: showShadow
                    ? `0 10px 20px ${shadowColor}`
                    : "none",
                  opacity: showShadow ? shadowOpacity : 1,
                }}
                data-ai-hint="gallery image"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
