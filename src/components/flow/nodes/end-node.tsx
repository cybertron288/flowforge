import { Handle, Position } from '@xyflow/react';


export function EndNode() {

    return (
        <div className="border p-2 border-primary rounded-md bg-white px-6">
            <div>
                End
            </div>
            <Handle type="target" position={Position.Top} id="end-node" />
        </div>
    );
}
