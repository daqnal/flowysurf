import { motion } from "motion/react";

export default function MinorButton({ title, setPageIndex, pageId }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="btn btn-primary btn-soft flex-1"
      onClick={() => setPageIndex(pageId)}
    >
      {title}
    </motion.button>
  );
}
