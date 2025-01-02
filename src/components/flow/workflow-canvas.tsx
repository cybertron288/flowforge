// src/components/flow/workflow-canvas.tsx
'use client';

import {
    Background,
    Connection,
    ConnectionMode,
    Controls,
    Panel,
    ReactFlow,
    useReactFlow, Viewport
} from '@xyflow/react';
import { useCallback, useEffect } from 'react';

import { useWorkflowStore } from '@/store/workflow-store';
import { ActionNode } from '@/components/flow/nodes/action-node';
import { StartNode } from '@/components/flow/nodes/start-node';
import { EndNode } from '@/components/flow/nodes/end-node';

const nodeTypes = {
    action: ActionNode,
    start: StartNode,
    end: EndNode
};

const defaultEdgeOptions = {
    animated: true,
    type: 'smoothstep'
};

const defaultViewport = { x: 0, y: 0, zoom: 0.5 };

export function WorkflowCanvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onViewportChange
    } = useWorkflowStore(
        (state) => (state)
    );

    const { getZoom, getViewport } = useReactFlow()

    const handleConnect = useCallback(
        (params: Connection) => {
            // Ensure we're connecting from source to target
            if (params.source && params.target) {
                onConnect(params);
            }
        },
        [onConnect]
    );

    const handleViewportChange = (e: Viewport) => {
        // console.log("zoom level", e)
        onViewportChange(e)
    }

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
                minZoom={0.3}
                onViewportChange={handleViewportChange}
                proOptions={{ hideAttribution: true }}
            >
                <Background />
                <Controls />
                <Panel position="bottom-right">
                    <div className="bg-background/60 backdrop-blur-sm p-2 rounded-md shadow-lg">
                        <p className="text-sm text-muted-foreground">
                            Press <kbd className="px-2 py-1 bg-muted rounded">⌘</kbd> +{' '}
                            <kbd className="px-2 py-1 bg-muted rounded">K</kbd> to search actions
                        </p>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}