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

interface ActionInputs {
    description: string;
    required: boolean;
    default: string;
};

interface NodeObject {
    nodeId: string;
    uuid: string;
    id: number;
    name: string;
    description: string;
    slug: string;
    ownerLogin: string;
    type: "repository_action"; // if this can have other values, replace with `string`
    color: string;
    iconSvg: string;
    stars: number;
    isVerifiedOwner: boolean;
    categories: string[]; // If categories may include other types, use `(string | OtherType)[]`
    externalUsesPathPrefix: string;
    globalRelayId: string;
    createdAt: string; // Use `Date` if parsed into a JavaScript Date object
    actionInputs: {
        args: ActionInputs;
    };
    repoPath: string;
};

interface WorkflowState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    onViewportChange: (viewport: Viewport) => void;
    addNode: (node: Node | null) => void;
    updateNode: (node: NodeObject, nodeInputData: any) => void;
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
            console.log("node", node);
            set((state) => ({
                nodes: [...state?.nodes, node],
            }));
        }
    },
    updateNode: (node: NodeObject, nodeInputData: any) => {
        if (node) {
            console.log("updating nodeIndex", node)
            const selectedNode = get().nodes.find((n) => n.id === node.nodeId);
            const nodeIndex = get().nodes.findIndex((n) => n.id === node.nodeId);
            console.log("updated nodeIndex", nodeIndex);
            if (selectedNode && nodeIndex !== -1) {
                get().nodes[nodeIndex].data.actionInputsData = nodeInputData;
            }
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

        console.log("generate workflow state", state);
        const workflow = generateWorkflowFromData(state);
        return workflow;
    },
}));
