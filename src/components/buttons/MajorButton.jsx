import { motion } from "motion/react";

export default function MajorButton({ title, setPageIndex, pageId, onClick }) {
  // If an onClick is passed, call that. Otherwise, fall back to navigation when pageId is provided.
  function handleClick() {
    if (typeof onClick === "function") return onClick();
    if (Number.isInteger(pageId) && setPageIndex) return setPageIndex(pageId);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="btn btn-primary flex-1 py-2"
      onClick={handleClick}
    >
      {title}
    </motion.button>
  );
}
