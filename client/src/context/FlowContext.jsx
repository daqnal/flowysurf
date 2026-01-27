import { createContext, useContext, useState, useCallback } from "react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";

const FlowContext = createContext(null);

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

const initialEdges = [];

export function FlowProvider({ children }) {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
        []
    );

    const onConnect = useCallback(
        (params) => setEdges((es) => addEdge(params, es)),
        []
    );

    const value = {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect
    };

    return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

export const useFlow = () => {
    const ctx = useContext(FlowContext);
    if (!ctx) {
        throw new Error("useFlow must be used inside FlowProvider");
    }
    return ctx;
}