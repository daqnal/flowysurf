import { motion } from "motion/react";
import { Handle } from "@xyflow/react";
import "./Nodes.css"

import { Goal } from "lucide-react";

export default function MilestoneNode() {
  return (
    <>
      <motion.div
        className="node-inner p-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex place-content-center justify-center gap-2">
            <input type="text" placeholder="Milestone title" className="input input-lg input-ghost" />
            <Goal className="w-10 m-auto" />
          </div>
          <textarea className="textarea" placeholder="Description"></textarea>
        </div>


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
          }}
        />
      </motion.div>
      <Handle type="source" position="left" />
      <Handle type="target" position="right" />
    </>
  );
}
