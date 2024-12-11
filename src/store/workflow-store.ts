// src/store/workflow-store.ts
import { create } from 'zustand';
import {
    Node,
    Edge,
    applyNodeChanges,
    applyEdgeChanges,
    OnNodesChange,
    OnEdgesChange,
    Connection,
    addEdge
} from '@xyflow/react';
import yaml from 'js-yaml';

interface WorkflowState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    addNode: (node: Node) => void;
    clearWorkflow: () => void;
    exportToYAML: () => string;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
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
    addNode: (node) => {
        set((state) => ({
            nodes: [...state.nodes, node],
        }));
    },
    clearWorkflow: () => {
        set({ nodes: [], edges: [] });
    },
    exportToYAML: () => {
        const state = get();
        const workflow = {
            nodes: state.nodes.map(node => ({
                id: node.id,
                type: node.type,
                data: node.data,
                position: node.position
            })),
            edges: state.edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target
            }))
        };
        return yaml.dump(workflow);
    },
}));