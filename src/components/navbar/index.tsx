import { PlusIcon, UploadIcon } from 'lucide-react';
import { useSession } from "next-auth/react";
import { v4 } from 'uuid';

import { NavUser } from "@/components/navbar/nav-user";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWorkflowStore } from "@/stores/workflow-store";

const USER_DATA = {
    name: "Ravi",
    email: "ravi@mail.com",
    image: "/avatars/shadcn.jpg",
}

export const Navbar = () => {
    const { addNode, generateWorkflow } = useWorkflowStore();
    const { data: session } = useSession();

    const handleAddNode = () => {
        const position = { x: Math.random() * 500, y: Math.random() * 300 };
        const newNode = {
            id: v4(),
            type: 'action',
            position: position,
        }
        // @ts-ignore
        addNode(newNode);
    };

    const handleExportYAML = () => {
        const yamlContent = generateWorkflow();
        console.log("workflow data", yamlContent)
        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'workflow.yaml';
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
    };


    return (
        <header className="border-b border-border px-6 py-3 flex items-center justify-between" >

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
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Export YAML
                    </Button>

                </div>
            </div>
            <div className="flex items-center gap-4">
                {session?.user && (
                    <NavUser user={session?.user as { name?: string; email?: string; image?: string } || USER_DATA} />
                )}
            </div>
        </header>);
};