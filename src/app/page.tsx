"use client";

import { ReactFlowProvider } from "@xyflow/react";

import { WorkflowCanvas } from "@/components/flow/workflow-canvas";
import { PropertiesPanel } from "@/components/flow/workflow-properties/properties-panel";
import { CommandPalette } from "@/components/search/command-palette";
import { Navbar } from "@/components/ui/navbar";


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
