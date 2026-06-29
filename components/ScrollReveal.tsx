"use client";

import React from "react";
import { motion } from "framer-motion";

export const retroSpring = {
  type: "spring" as const,
  stiffness: 140, // Perfect snappy retro bounce
  damping: 15,    // Slightly higher damping to prevent endless wobble
  mass: 0.8,
};

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const getVariants = () => {
    switch (direction) {
      case "up":
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
        };
      case "down":
        return {
          initial: { opacity: 0, y: -30 },
          animate: { opacity: 1, y: 0 },
        };
      case "left":
        return {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
        };
      case "right":
        return {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      initial={variants.initial}
      whileInView={variants.animate}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        ...retroSpring,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
