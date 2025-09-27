import { motion } from "motion/react";

export default function TinyButton({
  icon: Icon,
  address,
  pageId,
  setPageIndex,
  onBoard,
  tooltipText,
  component: Component,
}) {
  return (
    <div className="tooltip" data-tip={tooltipText}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={
          onBoard
            ? "btn btn-primary btn-circle btn-soft btn-sm"
            : "btn btn-primary btn-circle btn-soft"
        }
        onClick={
          Number.isInteger(pageId) ? () => setPageIndex(pageId) : <Component />
        }
      >
        <a href={address} target="_blank">
          <Icon className={onBoard ? "w-5" : ""} />
        </a>
      </motion.button>
    </div>
  );
}
