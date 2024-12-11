'use client';

import { WorkflowCanvas } from '@/components/flow/workflow-canvas';
import { CommandPalette } from '@/components/search/command-palette';
import { Button } from '@/components/ui/button';
import { PlusIcon, DownloadIcon } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflow-store';

export default function Home() {
  const { addNode, exportToYAML } = useWorkflowStore();

  const handleAddNode = () => {
    const position = { x: Math.random() * 500, y: Math.random() * 300 };
    const newNode = {
      id: `action-${Date.now()}`,
      type: 'action',
      position,
      data: {
        label: 'New Action',
        actionUrl: 'https://api.example.com/action',
        description: 'Description of the action'
      }
    };
    addNode(newNode);
  };

  const handleExportYAML = () => {
    const yamlContent = exportToYAML();
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">FlowForge</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAddNode}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Workflow Node
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportYAML}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export YAML
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded">⌘</kbd> +{' '}
            <kbd className="px-2 py-1 bg-muted rounded">K</kbd> to search actions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </main>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
