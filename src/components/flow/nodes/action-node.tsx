'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayIcon, Cog } from 'lucide-react';

interface ActionNodeData {
    label: string;
    actionUrl: string;
    description?: string;
    inputs?: Record<string, any>;
}

export function ActionNode({ data, isConnectable }: NodeProps<ActionNodeData>) {
    return (
        <Card className="w-[280px] bg-white shadow-lg">
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="!bg-muted-foreground"
            />

            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center space-x-2">
                    <PlayIcon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm">{data.label}</h3>
                </div>
                <Badge className="text-xs">
                    Action
                </Badge>
            </CardHeader>

            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                {data.description && (
                    <p className="mb-2">{data.description}</p>
                )}
                <div className="flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{data.actionUrl}</span>
                    <button
                        className="p-1 hover:bg-accent rounded-sm transition-colors"
                        onClick={() => {
                            // TODO: Open configuration modal
                            console.log('Configure action:', data.label);
                        }}
                    >
                        <Cog className="h-4 w-4" />
                    </button>
                </div>
            </CardContent>

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="!bg-muted-foreground"
            />
        </Card>
    );
}