"use client";

import { WorkflowCanvas } from "@/components/flow/workflow-canvas";
import { CommandPalette } from "@/components/search/command-palette";

import { PropertiesPanel } from "@/components/flow/workflow-properties/properties-panel";
import { ReactFlowProvider } from "@xyflow/react";

import { Navbar } from "@/components/ui/navbar";

const POSITION = { x: Math.random() * 500, y: Math.random() * 300 };

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
