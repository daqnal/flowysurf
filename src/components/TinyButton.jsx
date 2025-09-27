import { motion } from "motion/react";

export default function TinyButton({ icon: Icon, address }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="btn btn-primary btn-circle btn-soft"
    >
      <a href={address} target="_blank">
        <Icon />
      </a>
    </motion.button>
  );
}
