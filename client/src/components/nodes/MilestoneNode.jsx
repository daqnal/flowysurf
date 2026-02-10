import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Handle, useReactFlow } from "@xyflow/react";
import "./Nodes.css";

import { Goal } from "lucide-react";

export default function MilestoneNode(props) {
  const { id, data = {} } = props;
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [title, setTitle] = useState(() => (data && (data.title || data.name || data.label)) || "");
  const [description, setDescription] = useState(() => (data && (data.description || "")));
  const [deadline, setDeadline] = useState(() => (data && data.deadline) || "");
  const percent = 0;

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
            <input
              type="text"
              placeholder="Milestone title"
              className="input input-lg input-ghost"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  try {
                    e.currentTarget.blur();
                  } catch (err) { }
                  e.stopPropagation();
                }
              }}
            />
            <Goal className="w-10 m-auto" />
          </div>

          <div className="relative w-full">
            <progress className="progress progress-secondary w-full h-6" value={percent} max="100"></progress>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", bottom: "5px" }}>
              <span className="text-sm font-medium flex align-center">{`${completedTasks}/${totalTasks}`}</span>
            </div>
          </div>

          <div className="flex">
            <label htmlFor={`${id}-date-picker`}>Deadline:</label>
            <input
              type="date"
              name={`${id}-date-picker`}
              id={`${id}-date-picker`}
              className="ml-2"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <textarea
            className="textarea w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onWheel={(e) => {
              // stop map from zooming/panning when scrolling inside textarea
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                try {
                  e.currentTarget.blur();
                } catch (err) { }
                e.stopPropagation();
              }
            }}
          ></textarea>
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
