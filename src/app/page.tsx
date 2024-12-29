'use client';

import { WorkflowCanvas } from '@/components/flow/workflow-canvas';
import { CommandPalette } from '@/components/search/command-palette';
import { Button } from '@/components/ui/button';
import { PlusIcon, DownloadIcon, TrendingUpDown } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflow-store';
import { ActionConfigureDrawer } from "@/components/drawers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PropertiesPanel } from "@/components/flow/workflow-properties/properties-panel";
import { v4 } from "uuid";


const POSITION = { x: Math.random() * 500, y: Math.random() * 300 };

const NEW_NODE_DATA = [
  {
    id: `action-trufflehog-oss`,
    type: 'action',
    position: POSITION,
    data: {
      "categories": [
        "continuous integration",
        "security"
      ],
      "color": "28a745",
      "description": "Scan Github Actions with TruffleHog\n",
      "iconSvg": "<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  width=\"24\"\n  height=\"24\"\n  viewBox=\"0 0 24 24\"\n  fill=\"none\"\n  stroke=\"currentColor\"\n  stroke-width=\"2\"\n  stroke-linecap=\"round\"\n  stroke-linejoin=\"round\"\n>\n  <path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" />\n</svg>\n",
      "id": 468277,
      "isVerifiedOwner": true,
      "name": "TruffleHog OSS",
      "ownerLogin": "trufflesecurity",
      "slug": "trufflehog-oss",
      "stars": 17562,
      "type": "repository_action",
      "externalUsesPathPrefix": "trufflesecurity/trufflehog@",
      "globalRelayId": "MDE2OlJlcG9zaXRvcnlBY3Rpb240NjgyNzc="
    }
  },
  {
    id: `action-metrics-embed`,
    type: 'action',
    position: POSITION,
    data: {
      "categories": [
        "utilities",
        "community"
      ],
      "color": "24292e",
      "description": "An infographics generator with 40+ plugins and 300+ options to display stats about your GitHub account\n",
      "iconSvg": "<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  width=\"24\"\n  height=\"24\"\n  viewBox=\"0 0 24 24\"\n  fill=\"none\"\n  stroke=\"currentColor\"\n  stroke-width=\"2\"\n  stroke-linecap=\"round\"\n  stroke-linejoin=\"round\"\n>\n  <path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" />\n  <circle cx=\"8.5\" cy=\"7\" r=\"4\" />\n  <polyline points=\"17 11 19 13 23 9\" />\n</svg>\n",
      "id": 96314,
      "isVerifiedOwner": false,
      "name": "Metrics embed",
      "ownerLogin": "lowlighter",
      "slug": "metrics-embed",
      "stars": 13943,
      "type": "repository_action",
      "externalUsesPathPrefix": "lowlighter/metrics@",
      "globalRelayId": "MDE2OlJlcG9zaXRvcnlBY3Rpb245NjMxNA=="
    }
  },
  {
    id: `action-super-linter`,
    type: 'action',
    position: POSITION,
    data: {
      "categories": [
        "code review",
        "code quality"
      ],
      "color": "ffffff",
      "description": "Super-linter is a ready-to-run collection of linters and code analyzers, to help validate your source code\n",
      "iconSvg": "<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  width=\"24\"\n  height=\"24\"\n  viewBox=\"0 0 24 24\"\n  fill=\"none\"\n  stroke=\"currentColor\"\n  stroke-width=\"2\"\n  stroke-linecap=\"round\"\n  stroke-linejoin=\"round\"\n>\n  <polyline points=\"9 11 12 14 22 4\" />\n  <path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\" />\n</svg>\n",
      "id": 62116,
      "isVerifiedOwner": true,
      "name": "Super-Linter",
      "ownerLogin": "super-linter",
      "slug": "super-linter",
      "stars": 9546,
      "type": "repository_action",
      "externalUsesPathPrefix": "super-linter/super-linter@",
      "globalRelayId": "MDE2OlJlcG9zaXRvcnlBY3Rpb242MjExNg=="
    }
  },
  {
    id: `action-checkout`,
    type: 'action',
    position: POSITION,
    data: {
      "categories": [
        "utilities"
      ],
      "color": "0366d6",
      "description": "Checkout a Git repository at a particular version\n",
      "iconSvg": "<svg width=\"91\" height=\"91\" viewBox=\"0 0 91 91\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M91 45.5C91 70.6289 70.629 91 45.5 91C20.371 91 0 70.6289 0 45.5C0 20.3711 20.371 0 45.5 0C70.629 0 91 20.3711 91 45.5ZM33.2774 70.9818L70.876 45.916C71.1728 45.7181 71.1728 45.2819 70.876 45.084L33.2774 20.0182C32.9451 19.7967 32.5 20.0349 32.5 20.4343V70.5657C32.5 70.9651 32.9451 71.2033 33.2774 70.9818Z\" fill=\"#FFFFFF\"/>\n</svg>\n",
      "id": 9753,
      "isVerifiedOwner": true,
      "name": "Checkout",
      "ownerLogin": "actions",
      "slug": "checkout",
      "stars": 6019,
      "type": "repository_action",
      "externalUsesPathPrefix": "actions/checkout@",
      "globalRelayId": "MDE2OlJlcG9zaXRvcnlBY3Rpb245NzUz"
    }
  },
  {
    id: `action-github-pages-action`,
    type: 'action',
    position: POSITION,
    data: {
      "categories": [
        "deployment",
        "publishing"
      ],
      "color": "0366d6",
      "description": "GitHub Actions for GitHub Pages 🚀 Deploy static files and publish your site easily. Static-Site-Generators-friendly\n",
      "iconSvg": "<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  width=\"24\"\n  height=\"24\"\n  viewBox=\"0 0 24 24\"\n  fill=\"none\"\n  stroke=\"currentColor\"\n  stroke-width=\"2\"\n  stroke-linecap=\"round\"\n  stroke-linejoin=\"round\"\n>\n  <polyline points=\"16 16 12 12 8 16\" />\n  <line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\" />\n  <path d=\"M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3\" />\n  <polyline points=\"16 16 12 12 8 16\" />\n</svg>\n",
      "id": 13442,
      "isVerifiedOwner": false,
      "name": "GitHub Pages action",
      "ownerLogin": "peaceiris",
      "slug": "github-pages-action",
      "stars": 4751,
      "type": "repository_action",
      "externalUsesPathPrefix": "peaceiris/actions-gh-pages@",
      "globalRelayId": "MDE2OlJlcG9zaXRvcnlBY3Rpb24xMzQ0Mg=="
    }
  },
  {
    id: `action-github-script`,
    type: 'action',
    position: POSITION,
    data: {
      "categories": [
        "utilities"
      ],
      "color": "0366d6",
      "description": "Run simple scripts using the GitHub client\n",
      "iconSvg": "<svg width=\"91\" height=\"91\" viewBox=\"0 0 91 91\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M91 45.5C91 70.6289 70.629 91 45.5 91C20.371 91 0 70.6289 0 45.5C0 20.3711 20.371 0 45.5 0C70.629 0 91 20.3711 91 45.5ZM33.2774 70.9818L70.876 45.916C71.1728 45.7181 71.1728 45.2819 70.876 45.084L33.2774 20.0182C32.9451 19.7967 32.5 20.0349 32.5 20.4343V70.5657C32.5 70.9651 32.9451 71.2033 33.2774 70.9818Z\" fill=\"#FFFFFF\"/>\n</svg>\n",
      "id": 12519,
      "isVerifiedOwner": true,
      "name": "GitHub Script",
      "ownerLogin": "actions",
      "slug": "github-script",
      "stars": 4259,
      "type": "repository_action",
      "externalUsesPathPrefix": "actions/github-script@",
      "globalRelayId": "MDE2OlJlcG9zaXRvcnlBY3Rpb24xMjUxOQ=="
    }
  }

]

export default function Home() {
  const { addNode, exportToYAML, generateWorkflow, listVersions } = useWorkflowStore();

  const handleAddNode = () => {
    const position = { x: Math.random() * 500, y: Math.random() * 300 };
    const newNode = {
      id: v4(),
      type: 'action',
    }
    newNode.position = position;
    addNode(newNode);
  };

  const handleExportYAML = () => {
    const yamlContent = generateWorkflow();
    console.log("workflow data", yamlContent)
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

  const handleListVersions = async () => {
    const versions = await listVersions()
    console.log("versions", versions)
  }

  return (
    <div className="flex h-screen flex-col flex-1">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold gap-2 flex items-center">
            <SidebarTrigger />
            <span>
              FlowForge
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAddNode}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Workflow Node
            </Button>

            <Button variant="outline" size="sm" onClick={handleExportYAML}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export YAML
            </Button>
            <Button variant="outline" size="sm" onClick={handleListVersions}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              List Versions
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



      <main className="flex-1 flex">

        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
        <PropertiesPanel />
      </main>
      {/* </SidebarProvider> */}






      {/* Command Palette */}
      <CommandPalette />
      {/* <ActionConfigureDrawer /> */}
    </div>
  );
}
