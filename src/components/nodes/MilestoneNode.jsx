import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Handle, useReactFlow } from "@xyflow/react";
import "./Nodes.css";

import { Goal } from "lucide-react";
import { subscribe } from "../../lib/flowEvents";

function normalizeTodos(raw) {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") return { text: item, done: false };
    if (typeof item === "object" && item !== null) return { text: item.text || "", done: !!item.done };
    return { text: String(item), done: false };
  });
}

export default function MilestoneNode(props) {
  const { id, data = {} } = props;
  const rf = useReactFlow();

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Recompute upstream task counts periodically so the milestone updates when other nodes change.
  useEffect(() => {
    // compute from current graph
    function computeFromGraph(nodes, edges) {
      try {
        const incoming = new Map();
        for (const e of edges) {
          const arr = incoming.get(e.target) || [];
          arr.push(e.source);
          incoming.set(e.target, arr);
        }

        const visited = new Set();
        const taskSet = new Set();
        const stack = [id];

        while (stack.length) {
          const nodeId = stack.pop();
          if (visited.has(nodeId)) continue;
          visited.add(nodeId);

          const sources = incoming.get(nodeId) || [];
          for (const srcId of sources) {
            if (visited.has(srcId)) continue;
            const srcNode = nodes.find((n) => n.id === srcId);
            if (!srcNode) continue;
            if (srcNode.type === "taskNode") taskSet.add(srcNode.id);
            stack.push(srcId);
          }
        }

        let total = taskSet.size;
        let completed = 0;
        if (total > 0) {
          for (const nid of taskSet) {
            const node = nodes.find((n) => n.id === nid);
            if (!node) continue;
            const todos = normalizeTodos(node.data && node.data.todos);
            const hasTodos = todos.length > 0;
            const allDone = hasTodos && todos.every((t) => !!t.done);
            if (allDone) completed += 1;
          }
        }

        setTotalTasks(total);
        setCompletedTasks(completed);
      } catch (e) {
        setTotalTasks(0);
        setCompletedTasks(0);
      }
    }

    // initial compute
    computeFromGraph(rf.getNodes ? rf.getNodes() : [], rf.getEdges ? rf.getEdges() : []);

    // subscribe to emitted graph updates
    const unsub = subscribe((payload) => {
      computeFromGraph(payload.nodes || [], payload.edges || []);
    });
    return () => unsub();
  }, [rf, id]);

  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

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

          <div className="relative w-full">
            <progress className="progress progress-secondary w-full h-6" value={percent} max="100"></progress>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <span className="text-sm font-medium">{`${completedTasks}/${totalTasks}`}</span>
            </div>
          </div>

          <textarea className="textarea w-full" placeholder="Description"></textarea>
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
