import { Handle } from "@xyflow/react";
import { motion } from "motion/react";

import "./Nodes.css";

export default function StartNode() {
  return (
    <>
      <motion.div
        className="node-inner p-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ zIndex: 1 }}
      >
        <b>Start</b>
        {/* flash overlay */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-primary)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            borderRadius: "var(--radius-box)",
            zIndex: 0,
          }}
        />
      </motion.div>
      <Handle type="target" position="right" />
    </>
  );
}
