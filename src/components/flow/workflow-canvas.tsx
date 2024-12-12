// src/components/flow/workflow-canvas.tsx
'use client';

import { useWorkflowStore } from '@/store/workflow-store';
import { useCallback } from 'react';
import {
    Background,
    ConnectionMode,
    Controls,
    Panel,
    ReactFlow,
    Connection
} from '@xyflow/react';
import { shallow } from 'zustand/shallow';
import { ActionNode } from './nodes/action-node';

const nodeTypes = {
    action: ActionNode,
};

const defaultEdgeOptions = {
    animated: true,
    type: 'smoothstep'
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export function WorkflowCanvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect
    } = useWorkflowStore(
        (state) => (state)
    );

    const handleConnect = useCallback(
        (params: Connection) => {
            // Ensure we're connecting from source to target
            if (params.source && params.target) {
                onConnect(params);
            }
        },
        [onConnect]
    );

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                defaultViewport={defaultViewport}
                connectionMode={ConnectionMode.Strict}
                fitView
                proOptions={{ hideAttribution: true }}
            >
                <Background />
                <Controls />
                <Panel position="bottom-right">
                    <div className="bg-background/60 backdrop-blur-sm p-2 rounded-md shadow-lg">
                        <p className="text-sm text-muted-foreground">
                            Drag and drop actions to create your workflow
                        </p>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}