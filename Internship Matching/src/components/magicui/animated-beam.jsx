import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnimatedBeam({ className, duration = 3, delay = 0 }) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className={cn(
        "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent",
        className
      )}
    />
  );
}
