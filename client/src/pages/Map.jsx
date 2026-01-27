import { useState } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
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
import { Info, House, Download, Upload, Plus, HardDrive } from "lucide-react";
import NewNodeButton from "../components/buttons/NewNodeButton";
import { pushToast } from "../components/Toasts";


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

      {showHelp && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Help</h3>
            <div className="py-2 flex flex-col gap-2">
              <p>Welcome to flowysurf! Here is a quick guide to get you started.</p>

              <p>The flowchart that you see is called the <i>Map</i>, and it displays <i>Nodes</i>. There are two different kinds of nodes: <i>Tasks</i> and <i>Milestones</i>.
              </p>

              <p>Tasks represent individual work items that can have subtasks. You can add subtasks by pressing Enter while editing a task, and mark them complete with the checkbox. When everything is done, you can mark the whole node as complete.</p>

              <p>Milestones represent key project goals and automatically track the completion of all upstream Tasks. As you complete Tasks, the corresponding Milestones will update to reflect your progress.</p>

              <p>To add a new node, click the <button className="btn btn-xs btn-circle btn-secondary btn-soft"><Plus className="w-4" /></button> in the bottom-right corner. You can drag nodes around to organize your map, and connect them by dragging from one node's handle to another's.</p>

              <p>To save your work, download the file to your computer using the <button className="btn btn-xs btn-circle btn-secondary btn-soft"><Download className="w-4" /></button> button. You can later reload it using the <button className="btn btn-xs btn-circle btn-secondary btn-soft"><Upload className="w-4" /></button> button. Your work is also automatically saved in your browser's local storage.</p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowHelp(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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