import { Plus, X, Goal, SquareCheck } from "lucide-react";

import "./NewNodeButton.css";

export default function NewNodeButton({ nodes, setNodes }) {
  function handleClick(type) {
    setNodes([
      ...nodes,
      {
        id: `n${nodes.length + 1}`,
        position: { x: 100, y: 0 },
        type: type,
      },
    ]);
  }

  return (
    <div className="fab">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-secondary btn-circle btn-soft"
      >
        <div className="tooltip tooltip-left" data-tip="Add node">
          <Plus />
        </div>
      </div>

      <div className="fab-close">
        <span className="btn btn-circle btn-sm btn-error">
          <X />
        </span>
      </div>

      <div>
        Task{" "}
        <button
          className="btn btn-sm btn-circle"
          onClick={() => handleClick("taskNode")}
        >
          <SquareCheck className="w-5" />
        </button>
      </div>
      <div>
        Milestone{" "}
        <button
          className="btn btn-sm btn-circle"
          onClick={() => handleClick("milestoneNode")}
        >
          <Goal className="w-5" />
        </button>
      </div>
    </div>
  );
}
