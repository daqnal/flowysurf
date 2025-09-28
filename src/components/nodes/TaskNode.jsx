import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Handle, useReactFlow } from "@xyflow/react";
import { X } from "lucide-react";
import "./Nodes.css";

function normalizeTodos(raw) {
  // Accept both string[] and {text,done}[] formats
  if (!raw) return [{ text: "", done: false }];
  if (!Array.isArray(raw)) return [{ text: String(raw), done: false }];
  return raw.map((item) => {
    if (typeof item === "string") return { text: item, done: false };
    if (typeof item === "object" && item !== null) return { text: item.text || "", done: !!item.done };
    return { text: String(item), done: false };
  });
}

export default function TaskNode(props) {
  const { id, data = {} } = props;
  const rf = useReactFlow();
  const [todos, setTodos] = useState(() => normalizeTodos(data.todos));
  const [done, setDone] = useState(() => !!data.done);
  const [title, setTitle] = useState(() => (data && (data.title || "")));
  const [description, setDescription] = useState(() => (data && (data.description || "")));
  const inputsRef = useRef([]);

  // sync when node data changes externally
  useEffect(() => {
    setTodos(normalizeTodos(data.todos));
    setTitle((data && (data.title || "")));
    setDescription((data && (data.description || "")));
  }, [data.todos]);

  // persist title/description to node data
  const persistMeta = useCallback(
    (next) => {
      try {
        rf.setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...next } } : n)));
        try {
          const { emit } = require("../../lib/flowEvents");
          emit({ nodes: rf.getNodes ? rf.getNodes() : [], edges: rf.getEdges ? rf.getEdges() : [] });
        } catch (e) {
          // ignore
        }
      } catch (e) {
        // ignore
      }
    },
    [id, rf]
  );

  const persist = useCallback(
    (nextTodos) => {
      setTodos(nextTodos);
      try {
        // persist only todos; do NOT automatically set top-level done from subtasks
        rf.setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, todos: nextTodos } } : n)));
        // notify external subscribers about the graph change
        try {
          const { emit } = require("../../lib/flowEvents");
          const payload = { nodes: rf.getNodes ? rf.getNodes() : [], edges: rf.getEdges ? rf.getEdges() : [] };
          emit(payload);
        } catch (e) {
          // ignore require errors outside of bundler
        }
      } catch (e) {
        // ignore in non-browser/test
      }
    },
    [id, rf]
  );

  const updateSubtask = (index, value) => {
    const next = todos.map((t, i) => (i === index ? { ...t, text: value } : t));
    persist(next);
  };

  const toggleDone = (index) => {
    const next = todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t));
    persist(next);
  };

  // persist top-level done when main checkbox toggled
  const toggleMainDone = () => {
    const nextDone = !done;
    setDone(nextDone);
    try {
      rf.setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, todos, done: nextDone } } : n)));
      try {
        const { emit } = require("../../lib/flowEvents");
        const payload = { nodes: rf.getNodes ? rf.getNodes() : [], edges: rf.getEdges ? rf.getEdges() : [] };
        emit(payload);
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore
    }
  };

  const addSubtask = (atIndex) => {
    const next = [...todos];
    const insertIndex = typeof atIndex === "number" ? atIndex + 1 : next.length;
    next.splice(insertIndex, 0, { text: "", done: false });
    persist(next);
    // focus will be handled after render via ref
    setTimeout(() => {
      const ref = inputsRef.current[insertIndex];
      if (ref) ref.focus();
    }, 0);
  };

  const removeSubtask = (index) => {
    const next = todos.filter((_, i) => i !== index);
    persist(next);
  };

  // handle Enter to add new todo below current
  const onKeyDown = (e, index) => {
    // Allow Escape to unfocus the input
    if (e.key === "Escape") {
      try {
        e.currentTarget.blur();
      } catch (err) { }
      e.stopPropagation();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addSubtask(index);
    }
  };

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
              type="checkbox"
              className="checkbox checkbox-xl m-auto"
              checked={done}
              onChange={toggleMainDone}
              aria-label={"Toggle task"}
            />
            <input
              type="text"
              placeholder="Task title"
              className="input input-lg input-ghost"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={(e) => persistMeta({ title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  try {
                    e.currentTarget.blur();
                  } catch (err) { }
                  e.stopPropagation();
                }
              }}
            />
          </div>

          <textarea
            className="textarea w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => persistMeta({ description: e.target.value })}
            onWheel={(e) => {
              // prevent wheel from bubbling to the map (which may zoom/pan)
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

          <div className="mt-2">
            {todos.length > 0 ? <div className="font-medium mb-1">Subtasks</div> : null}
            <div className="flex flex-col gap-2">
              {todos.map((t, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(i)}
                    aria-label={`Toggle subtask ${i + 1}`}
                  />
                  <input
                    ref={(el) => (inputsRef.current[i] = el)}
                    className={`input input-sm flex-1 ${t.done ? "line-through opacity-60" : ""}`}
                    value={t.text}
                    placeholder={`Subtask ${i + 1}`}
                    onChange={(e) => updateSubtask(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    disabled={t.done}
                    aria-disabled={t.done}
                  />
                  <button className="btn btn-xs btn-ghost pl-0 pr-2" onClick={() => removeSubtask(i)}>
                    <X />
                  </button>
                </div>
              ))}
              <div>
                <button className="btn btn-xs" onClick={() => addSubtask()}>
                  + Add subtask
                </button>
              </div>
            </div>
          </div>
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
