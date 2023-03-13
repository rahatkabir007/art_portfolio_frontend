const slideRight = {
  name: "Slide Right",
  variants: {
    initial: {
      opacity: 0,
      left: "-100%",
      scale: 0.6
    },
    animate: {
      opacity: 1,
      left: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      left: "100%",
      scale: 0.6
    }
  },
  transition: {
    duration: 0.7
  }
};

export const animations = [
  slideRight,
];