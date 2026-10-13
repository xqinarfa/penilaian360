import type { Variants } from "framer-motion";

export const easeExpo = [0.16, 1, 0.3, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: easeExpo,
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      delay: custom * 0.1,
      ease: easeExpo,
    },
  }),
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      delay: custom * 0.12,
      ease: easeExpo,
    },
  }),
};

export const scaleYLine: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.75,
      ease: easeExpo,
    },
  },
};

export const scaleXLine: Variants = {
  hidden: { scaleX: 0 },
  visible: (custom = 0) => ({
    scaleX: 1,
    transition: {
      duration: 0.6,
      delay: custom * 0.12,
      ease: easeExpo,
    },
  }),
};
export const slideContentVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeExpo },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export const stepCardContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.22,
      ease: easeExpo,
    },
  }),
};

export const stepCardFillRiseVariants: Variants = {
  hidden: {
    scaleY: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  visible: (i = 0) => ({
    scaleY: 1,
    transition: {
      duration: 0.75,
      delay: i * 0.22 + 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const stepCardContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.22 + 0.22,
      ease: easeExpo,
    },
  }),
};
