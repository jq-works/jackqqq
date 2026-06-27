export const retroSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 12,
  mass: 0.9,
};

export const itemReveal = {
  initial: { opacity: 0, scale: 0.92, y: 30 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};