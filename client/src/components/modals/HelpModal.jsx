import { Plus, Upload, Download } from "lucide-react";

export default function HelpModal({ setShowHelp }) {
    return (
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
    );
}