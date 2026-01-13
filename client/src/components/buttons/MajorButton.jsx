import { motion } from "motion/react";

export default function MajorButton({ title, onClick, soft }) {

  function handleClick() {
    return onClick();
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={soft ? "btn btn-primary btn-soft flex-1 py-2" : "btn btn-primary flex-1 py-2"}
      onClick={handleClick}
    >
      {title}
    </motion.button>
  );
}
