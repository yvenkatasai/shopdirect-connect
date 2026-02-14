import { motion, AnimatePresence } from "framer-motion";
import { Wrench } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 2200);
        }}
      >
        {/* Wavy background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M0,320 C240,200 480,360 720,280 C960,200 1200,340 1440,260 L1440,400 L0,400 Z"
              fill="currentColor"
              className="text-primary-foreground"
              initial={{ d: "M0,320 C240,200 480,360 720,280 C960,200 1200,340 1440,260 L1440,400 L0,400 Z" }}
              animate={{ d: "M0,280 C240,360 480,200 720,320 C960,360 1200,200 1440,300 L1440,400 L0,400 Z" }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </svg>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M0,350 C360,280 720,380 1080,300 C1260,260 1380,320 1440,310 L1440,400 L0,400 Z"
              fill="currentColor"
              className="text-accent"
              initial={{ d: "M0,350 C360,280 720,380 1080,300 C1260,260 1380,320 1440,310 L1440,400 L0,400 Z" }}
              animate={{ d: "M0,310 C360,380 720,280 1080,350 C1260,320 1380,280 1440,340 L1440,400 L0,400 Z" }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
            />
          </svg>
          <svg className="absolute top-0 w-full rotate-180" viewBox="0 0 1440 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M0,250 C300,150 600,280 900,200 C1100,150 1300,250 1440,220 L1440,300 L0,300 Z"
              fill="currentColor"
              className="text-primary-foreground"
              initial={{ d: "M0,250 C300,150 600,280 900,200 C1100,150 1300,250 1440,220 L1440,300 L0,300 Z" }}
              animate={{ d: "M0,200 C300,280 600,150 900,250 C1100,280 1300,150 1440,230 L1440,300 L0,300 Z" }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
            />
          </svg>
        </div>
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
            <Wrench className="h-10 w-10 text-accent-foreground" />
          </div>
        </motion.div>

        {/* Logo Text */}
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-4xl font-black tracking-tight text-primary-foreground"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Hardware
          </motion.span>
          <motion.span
            className="text-4xl font-black tracking-tight text-accent"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            HUB
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          className="mt-3 text-sm font-medium text-primary-foreground/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          Buy · Rent · Build
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-primary-foreground/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.0, delay: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
