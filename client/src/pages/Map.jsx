import { useState } from "react";
import {
  ReactFlow,
  Panel,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./FlowOverrides.css";

import StartNode from "../components/nodes/StartNode";
import TaskNode from "../components/nodes/TaskNode";
import MilestoneNode from "../components/nodes/MilestoneNode";
import MinorButton from "../components/buttons/MinorButton";
import { Info, House, Download, Upload, HardDrive } from "lucide-react";
import NewNodeButton from "../components/buttons/NewNodeButton";
import { pushToast } from "../components/Toasts";
import HelpModal from "../components/modals/HelpModal.jsx";
import ExitConfirmModal from "../components/modals/ExitConfirmModal.jsx";


import { useAuth } from "../context/AuthContext.jsx";
import { useFlow } from "../context/FlowContext.jsx";

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  milestoneNode: MilestoneNode,
};

export default function App({ setPageIndex }) {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect } = useFlow();

  const { user } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onEdgeClick={onEdgeClick}
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

          {user && (
            <MinorButton
              icon={HardDrive}
              onBoard={true}
              tooltipText={"Drive"}
              onClick={() => setPageIndex(3)}
            />
          )}

          {!user && (
            <>
              <MinorButton
                icon={Download}
                onBoard={true}
                tooltipText={"Download"}
                onClick={() => console.log("Download the file")}
              />

              <MinorButton
                icon={Upload}
                onBoard={true}
                tooltipText={"Load"}
                onClick={() => console.log("Load the chart from filesystem")}
              />
            </>
          )}
          <MinorButton icon={Info} onBoard={true} tooltipText={"Help"} onClick={() => setShowHelp(true)} />
        </Panel>

        <Panel position="bottom-right">
          <NewNodeButton nodes={nodes} setNodes={setNodes} />
        </Panel>
        <Panel position="top" className="w-full flex justify-center">
          <div className="overflow-x-auto">
            <ul className="steps steps-vertical sm:steps-horizontal scale-75">
            </ul>
          </div>
        </Panel>
      </ReactFlow>

      {showHelp && (<HelpModal setShowHelp={setShowHelp} />)}

      {showConfirm && <ExitConfirmModal setShowConfirm={setShowConfirm} setPageIndex={setPageIndex} />}
    </div>
  );
}