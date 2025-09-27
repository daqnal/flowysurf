import { Info } from "lucide-react";
import { motion } from "motion/react";

export default function HelpButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="btn btn-circle btn-sm btn-soft"
    >
      <Info />
    </motion.button>
  );
}
