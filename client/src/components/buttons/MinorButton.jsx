import { motion } from "motion/react";

export default function MinorButton({
  icon: Icon,
  address,
  pageId,
  setPageIndex,
  onBoard,
  tooltipText,
  onClick,
  soft
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
        className={`btn btn-circle ${soft && "btn-soft"} ${onBoard ? "btn-sm" : "btn-primary"}`}
        onClick={handleClick}
        type="button"
      >
        <Icon className={onBoard ? "w-5" : ""} />
      </motion.button>
    </div>
  );
}
