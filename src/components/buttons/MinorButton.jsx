import { motion } from "motion/react";

export default function MinorButton({
  icon: Icon,
  address,
  pageId,
  setPageIndex,
  onBoard,
  tooltipText,
  onClick,
}) {
  // Compose an onClick handler with clear precedence:
  // 1. explicit onClick prop
  // 2. navigation to pageId via setPageIndex
  // 3. open address (if provided)
  const handleClick = (e) => {
    if (typeof onClick === "function") return onClick(e);
    if (Number.isInteger(pageId) && typeof setPageIndex === "function")
      return setPageIndex(pageId);
    if (address) {
      window.open(address, "_blank", "noopener,noreferrer");
    }
  };

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
        onClick={handleClick}
        type="button"
      >
        <Icon className={onBoard ? "w-5" : ""} />
      </motion.button>
    </div>
  );
}
