"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { CommandPalette } from "@/components/command-palette/index.";
import { WorkflowCanvas } from "@/components/flow/workflow-canvas";
import { PropertiesPanel } from "@/components/flow/workflow-properties/properties-panel";
import { Navbar } from "@/components/navbar";


export default function Home() {
    const { data: session } = useSession();

    useEffect(() => {
        console.log(session);
    }, [session])

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
