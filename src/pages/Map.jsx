import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";

import "./FlowOverrides.css";

import StartNode from "../components/nodes/StartNode";
import TaskNode from "../components/nodes/TaskNode";
import MilestoneNode from "../components/nodes/MilestoneNode";
import MinorButton from "../components/buttons/MinorButton";
import { emit as emitFlowEvent } from "../lib/flowEvents";

import { Info, House, Download, Upload } from "lucide-react";
import NewNodeButton from "../components/buttons/NewNodeButton";
import { pushToast } from "../components/Toasts";

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    type: "startNode",
    draggable: false,
    deletable: false,
    focusable: false,
  },
];

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  milestoneNode: MilestoneNode,
};

const initialEdges = [];

export default function App({ setPageIndex }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [showConfirm, setShowConfirm] = useState(false);

  const autosaveTimer = useRef(null);

  // load from localStorage (auto-restore)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("flowymap-v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.nodes) setNodes(parsed.nodes);
        if (parsed.edges) setEdges(parsed.edges);
      }
    } catch (err) {
      console.warn("Failed to parse saved flowymap data", err);
    }
  }, []);

  // autosave to localStorage when nodes or edges change (debounced)
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      const payload = { nodes, edges, version: "1" };
      try {
        localStorage.setItem("flowymap-v1", JSON.stringify(payload));
      } catch (err) {
        console.warn("Failed to autosave", err);
      }
    }, 500);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [nodes, edges]);

  // notify other listeners about node/edge updates so node components can react
  useEffect(() => {
    try {
      emitFlowEvent({ nodes, edges });
    } catch (e) {
      // ignore
    }
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes) => {
      // detect removal changes to animate them
      const removes = changes.filter((c) => c.type === "remove").map((c) => c.id);
      if (!removes.length) {
        // default behaviour
        setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        return;
      }

      // mark nodes as removing to apply CSS animation
      setNodes((nodesSnapshot) =>
        nodesSnapshot.map((n) =>
          removes.includes(n.id) ? { ...n, className: `${n.className || ""} removing` } : n
        )
      );

      // after animation duration, actually remove nodes and their connected edges
      setTimeout(() => {
        setNodes((nodesSnapshot) => nodesSnapshot.filter((n) => !removes.includes(n.id)));
        setEdges((edgesSnapshot) =>
          edgesSnapshot.filter((e) => !removes.includes(e.source) && !removes.includes(e.target))
        );
      }, 240);
    },
    [setEdges]
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        fitView
        fitViewOptions={{ padding: 1, maxZoom: 1.5, minZoom: 0.2 }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Panel position="bottom-left" className="flex gap-2">
          <MinorButton
            icon={House}
            onBoard={true}
            tooltipText={"Home"}
            onClick={() => setShowConfirm(true)}
          />
          <MinorButton
            icon={Download}
            onBoard={true}
            tooltipText={"Download"}
            onClick={() => {
              try {
                const data = { nodes, edges, version: "1" };
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const ts = new Date().toISOString().replace(/[:.]/g, "-");
                const filename = `flowymap-${ts}.flowy`;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                pushToast(`Exported ${filename}`, "success");
              } catch (err) {
                console.error(err);
                pushToast("Failed to export .flowy", "error");
              }
            }}
          />
          <MinorButton
            icon={Upload}
            onBoard={true}
            tooltipText={"Load"}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".flowy,application/json";
              input.onchange = async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const parsed = JSON.parse(text);
                  if (parsed.nodes) setNodes(parsed.nodes);
                  if (parsed.edges) setEdges(parsed.edges);
                  localStorage.setItem("flowymap-v1", JSON.stringify(parsed));
                  pushToast(`Loaded ${file.name}`, "success");
                } catch (err) {
                  console.error(err);
                  pushToast("Failed to load .flowy file", "error");
                }
              };
              input.click();
            }}
          />
          <MinorButton icon={Info} onBoard={true} tooltipText={"Help"} />
        </Panel>
        <Panel position="bottom-right">
          <NewNodeButton nodes={nodes} setNodes={setNodes} />
        </Panel>
        <Panel position="top" className="w-full flex justify-center">
          <div className="overflow-x-auto">
            {/* Dynamic milestone steps: each Milestone node becomes an li */}
            <ul className="steps steps-vertical sm:steps-horizontal scale-75">
              {(() => {
                // compute adjacency maps
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

                function getUpstreamTaskNodeIds(startId) {
                  const visited = new Set();
                  const taskNodeIds = new Set();
                  const stack = [startId];
                  while (stack.length) {
                    const nodeId = stack.pop();
                    if (visited.has(nodeId)) continue;
                    visited.add(nodeId);
                    const neighbors = new Set([...(incoming.get(nodeId) || []), ...(outgoing.get(nodeId) || [])]);
                    for (const nbrId of neighbors) {
                      if (visited.has(nbrId)) continue;
                      const nbrNode = nodes.find((n) => n.id === nbrId);
                      if (!nbrNode) continue;
                      if (nbrNode.type === "taskNode") taskNodeIds.add(nbrNode.id);
                      if (nbrNode.type !== "startNode" && nbrNode.type !== "milestoneNode") {
                        stack.push(nbrId);
                      }
                    }
                  }
                  return Array.from(taskNodeIds);
                }

                const milestoneNodes = nodes.filter((n) => n.type === "milestoneNode");
                if (!milestoneNodes.length) return null;
                return milestoneNodes.map((mNode, idx) => {
                  const upstream = getUpstreamTaskNodeIds(mNode.id);
                  const total = upstream.length;
                  const completed = upstream.reduce((acc, nid) => {
                    const node = nodes.find((n) => n.id === nid);
                    return acc + (node && node.data && node.data.done ? 1 : 0);
                  }, 0);
                  const isComplete = total > 0 && completed === total;
                  const title = (mNode.data && (mNode.data.title || mNode.data.name || mNode.data.label)) || `Milestone ${idx + 1}`;
                  return (
                    <li key={mNode.id} className={`step ${isComplete ? "step-primary" : ""}`}>
                      {title}
                    </li>
                  );
                });
              })()}
            </ul>
          </div>
        </Panel>
      </ReactFlow>


      {/* Confirmation modal: warn user they'll lose changes when navigating home */}
      {showConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Leave map?</h3>
            <p className="py-4">If you go home now you will lose unsaved changes. Continue?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  setShowConfirm(false);
                  setPageIndex(0);
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
