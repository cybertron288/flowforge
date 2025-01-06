import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    Node,
    OnEdgesChange,
    OnNodesChange,
    Viewport,
} from "@xyflow/react";
import yaml from "js-yaml";
import { create } from "zustand";

import { generateWorkflowFromData } from "@/lib/yaml";
import { v4 } from "uuid";

interface WorkflowState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    onViewportChange: (viewport: Viewport) => void;
    addNode: (node: Node | null) => void;
    clearWorkflow: () => void;
    exportToYAML: () => string;
    generateWorkflow: () => string;
    viewport: Viewport;
}

const initialNodes: Node[] = [
    {
        position: { x: -100, y: -300 },
        id: v4(),
        data: { name: "Start" },
        type: "start",
        deletable: false,
    },
    {
        position: { x: 100, y: 300 },
        id: v4(),
        data: { name: "End" },
        type: "end",
        deletable: false,
    },
];
const initialEdges: Edge[] = [];
const viewport: Viewport = {
    x: 0,
    y: 0,
    zoom: 0,
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    viewport,
    onNodesChange: (changes) => {
        set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
        }));
    },
    onEdgesChange: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
        }));
    },
    onConnect: (connection) => {
        set((state) => ({
            edges: addEdge(connection, state.edges),
        }));
    },
    onViewportChange: (viewport: Viewport) => {
        set({
            viewport: viewport,
        });
    },
    addNode: (node: Node | null) => {
        if (node) {
            set((state) => ({
                nodes: [...state?.nodes, node],
            }));
        }
    },
    setNode: (node: Node) => {
        if (node) {
            set((state) => ({
                nodes: [...state?.nodes, node],
            }));
        }
    },
    clearWorkflow: () => {
        set({ nodes: [], edges: [] });
    },
    exportToYAML: () => {
        const state = get();
        const workflow = {
            nodes: state.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                data: node.data,
                position: node.position,
            })),
            edges: state.edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
            })),
        };
        console.log("workflow", workflow);
        return yaml.dump(workflow);
    },
    generateWorkflow: () => {
        const state = get();

        // get input values for workflow from server before generating the workflow

        // validate the workflow inputs

        const workflow = generateWorkflowFromData(state);
        return workflow;
    },
}));