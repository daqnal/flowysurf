import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Handle, useReactFlow } from "@xyflow/react";
import "./Nodes.css";

import { Goal } from "lucide-react";
import { subscribe } from "../../lib/flowEvents";
import JSConfetti from "js-confetti";

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
  const confettiRef = useMemo(() => ({ js: null }), []);
  const prevCompleteRef = useMemo(() => ({ wasComplete: false }), []);
  const [title, setTitle] = useState(() => (data && (data.title || data.name || data.label)) || "");

  // Helper to recursively find all upstream TaskNodes
  function getUpstreamTaskNodes(startId, nodes, edges) {
    // Build adjacency maps for both directions to be robust to reversed source/target
    const incoming = new Map();
    const outgoing = new Map();
    for (const e of edges) {
      const ins = incoming.get(e.target) || [];
      ins.push(e.source);
      incoming.set(e.target, ins);

      const outs = outgoing.get(e.source) || [];
      outs.push(e.target);
      outgoing.set(e.source, outs);
    }
    // For debug: show adjacency for this node set
    // console.log("[MilestoneNode] adjacency incoming:", Array.from(incoming.entries()));
    // console.log("[MilestoneNode] adjacency outgoing:", Array.from(outgoing.entries()));

    const visited = new Set();
    const taskNodeIds = new Set();
    const stack = [startId];

    while (stack.length) {
      const nodeId = stack.pop();
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      // consider both incoming and outgoing neighbors so we handle reversed edge directions
      const neighbors = new Set([...(incoming.get(nodeId) || []), ...(outgoing.get(nodeId) || [])]);
      for (const nbrId of neighbors) {
        if (visited.has(nbrId)) continue;
        const nbrNode = nodes.find((n) => n.id === nbrId);
        if (!nbrNode) continue;
        if (nbrNode.type === "taskNode") taskNodeIds.add(nbrNode.id);
        // Traverse through intermediate nodes unless they're Start or Milestone nodes
        if (nbrNode.type !== "startNode" && nbrNode.type !== "milestoneNode") {
          stack.push(nbrId);
        }
      }
    }

    return Array.from(taskNodeIds);
  }

  useEffect(() => {
    // initialize js-confetti once on mount
    try {
      confettiRef.js = new JSConfetti();
    } catch (e) {
      // ignore if not available in test env
      confettiRef.js = null;
    }
    function computeProgress() {
      const nodes = rf.getNodes ? rf.getNodes() : [];
      const edges = rf.getEdges ? rf.getEdges() : [];
      // compute progress without debug logging
      const upstreamTaskNodeIds = getUpstreamTaskNodes(id, nodes, edges);
      // also log the incoming mapping for easier debug
      // no debug logs
      let completed = 0;
      for (const nid of upstreamTaskNodeIds) {
        const node = nodes.find((n) => n.id === nid);
        if (!node) continue;
        // Only respect the top-level "done" flag set by the main checkbox on TaskNode
        if (node.data && typeof node.data.done === "boolean") {
          if (node.data.done) completed += 1;
        }
      }
      setTotalTasks(upstreamTaskNodeIds.length);
      setCompletedTasks(completed);

      // if milestone just became complete, fire confetti once
      const isComplete = upstreamTaskNodeIds.length > 0 && completed === upstreamTaskNodeIds.length;
      if (isComplete && !prevCompleteRef.wasComplete) {
        prevCompleteRef.wasComplete = true;
        try {
          if (confettiRef.js && typeof confettiRef.js.addConfetti === "function") {
            confettiRef.js.addConfetti();
          }
        } catch (err) {
          // ignore confetti errors
        }
      }
      if (!isComplete) prevCompleteRef.wasComplete = false;
    }
    computeProgress();
    const unsub = subscribe((payload) => {
      computeProgress();
    });
    return () => unsub();
  }, [rf, id]);

  // keep local title in sync if external data changes
  useEffect(() => {
    setTitle((data && (data.title || data.name || data.label)) || "");
  }, [data && data.title, data && data.name, data && data.label]);

  // persist title to the node's data and notify listeners
  function persistTitle(nextTitle) {
    setTitle(nextTitle);
    try {
      rf.setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, title: nextTitle } } : n)));
    } catch (e) {
      // ignore
    }
    try {
      const { emit } = require("../../lib/flowEvents");
      emit({ nodes: rf.getNodes ? rf.getNodes() : [], edges: rf.getEdges ? rf.getEdges() : [] });
    } catch (e) {
      // ignore
    }
  }

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
            <input
              type="text"
              placeholder="Milestone title"
              className="input input-lg input-ghost"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={(e) => persistTitle(e.target.value)}
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
            <input type="date" name={`${id}-date-picker`} id={id} className="ml-2" />
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
