import { motion, AnimatePresence } from "framer-motion";
import { Wrench } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 2200);
        }}
      >
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
