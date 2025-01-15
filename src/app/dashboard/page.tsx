"use client";

import { ReactFlowProvider } from "@xyflow/react";


import { CommandPalette } from "@/components/command-palette";
import { WorkflowCanvas } from "@/components/canvas/workflow-canvas";
import { PropertiesPanel } from "@/components/canvas/workflow-properties/properties-panel";
import { Navbar } from "@/components/navbar";


export default function Home() {

    return (
        <div className="flex h-screen flex-col flex-1">
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 flex">
                <ReactFlowProvider>
                    <WorkflowCanvas />
                </ReactFlowProvider>
                <PropertiesPanel />
            </main>

            {/* Command Palette */}
            <CommandPalette />
            {/* <ActionConfigureDrawer /> */}
        </div>
    );
}
