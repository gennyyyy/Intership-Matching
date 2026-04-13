import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AnimatedGradientText({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex animate-gradient bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
