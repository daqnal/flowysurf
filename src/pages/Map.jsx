import { useState, useCallback } from "react";
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
import TinyButton from "../components/buttons/TinyButton";

import { Info, House, Download } from "lucide-react";
import NewNodeButton from "../components/buttons/NewNodeButton";

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

const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function App({ setPageIndex }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
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
      >
        <Background variant={BackgroundVariant.Dots} />
        <Panel position="bottom-left" className="flex gap-2">
          <TinyButton
            icon={House}
            onBoard={true}
            pageId={0}
            setPageIndex={setPageIndex}
            tooltipText={"Home"}
          />
          <TinyButton
            icon={Download}
            onBoard={true}
            tooltipText={"Save as PDF"}
          />
          <TinyButton icon={Info} onBoard={true} tooltipText={"Help"} />
        </Panel>
        <Panel position="bottom-right">
          <NewNodeButton nodes={nodes} setNodes={setNodes} />
        </Panel>
      </ReactFlow>
    </div>
  );
}
