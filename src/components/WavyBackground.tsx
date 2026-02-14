import { motion } from "framer-motion";

const WavyBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-20">
    <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M0,320 C240,200 480,360 720,280 C960,200 1200,340 1440,260 L1440,400 L0,400 Z"
        fill="currentColor"
        className="text-primary"
        animate={{ d: "M0,280 C240,360 480,200 720,320 C960,360 1200,200 1440,300 L1440,400 L0,400 Z" }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
    </svg>
    <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M0,350 C360,280 720,380 1080,300 C1260,260 1380,320 1440,310 L1440,400 L0,400 Z"
        fill="currentColor"
        className="text-accent"
        animate={{ d: "M0,310 C360,380 720,280 1080,350 C1260,320 1380,280 1440,340 L1440,400 L0,400 Z" }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
    <svg className="absolute top-0 w-full rotate-180" viewBox="0 0 1440 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M0,250 C300,150 600,280 900,200 C1100,150 1300,250 1440,220 L1440,300 L0,300 Z"
        fill="currentColor"
        className="text-primary"
        animate={{ d: "M0,200 C300,280 600,150 900,250 C1100,280 1300,150 1440,230 L1440,300 L0,300 Z" }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
      />
    </svg>
  </div>
);

export default WavyBackground;
