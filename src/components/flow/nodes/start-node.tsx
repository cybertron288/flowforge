import { Handle, Position } from '@xyflow/react';


export function StartNode() {

    return (
        <div className="border p-2 bg-primary rounded-md text-primary-foreground px-6">
            <div>
                Start
            </div>
            <Handle type="source" position={Position.Bottom} id="start-node" />
        </div>
    );
}
