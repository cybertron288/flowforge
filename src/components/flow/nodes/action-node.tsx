"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { GitHubAction, searchGitHubActions } from "@/lib/github";
import { useWorkflowStore } from "@/store/workflow-store";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { PlayIcon, Cog, Link, Play, Settings } from "lucide-react";
import { useEffect, useState } from "react";

import "@reach/combobox/styles.css";
import { useDrawerStore } from "@/store/drawer-store";

interface ActionNodeData {
    label: string;
    actionUrl: string;
    description?: string;
    workflowId?: number;
    inputs?: Record<string, any>;
    owner?: string;
    repo?: string;
    selectedAction?: GitHubAction;
}

const WORKFLOW_NAME = "TruffleHog OSS";
const WORKFLOW_DESCRIPTION = "Scan Github Actions with TruffleHog";
const MARKETPLACE_URL_PREFIX = "https://github.com//marketplace/actions";

export function ActionNode({ data, isConnectable, selected }: NodeProps<ActionNodeData>) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actions, setActions] = useState<GitHubAction[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 300);
    const { viewport } = useWorkflowStore((state) => state);
    const { openActionConfigureDrawer } = useDrawerStore();

    // Calculate the inverse scale to counteract the zoom
    const scale = viewport.zoom;

    useEffect(() => {
        async function searchActions() {
            if (debouncedSearch.length >= 2) {
                setLoading(true);
                try {
                    const results = await searchGitHubActions(debouncedSearch);
                    setActions(results);
                } catch (error) {
                    console.error("Error searching actions:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setActions([]);
            }
        }

        searchActions();
    }, [debouncedSearch]);

    const handleActionSelect = async (actionId: string) => {
        const selectedAction = actions.find((action) => action.id === actionId);
        if (selectedAction) {
            console.log("Selected action:", selectedAction);
            setOpen(false);
        }
    };

    return (
        <Card
            // Highlight the card with a blue border when the node is selected
            className={`w-[280px] bg-white shadow-lg cursor-default border-0 transition-all ${selected ? " outline-dotted outline-1" : ""
                }`}
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="!bg-muted-foreground"
            />

            <CardHeader className="px-4 pt-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <Badge className="text-xs flex py-1 gap-1 items-center">
                    <PlayIcon className="h-3 w-3 text-white" />
                    Action
                </Badge>
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => {
                            openActionConfigureDrawer(data);
                            console.log("Configure action:", data.label);
                        }}
                        className="rounded-md p-1 hover:bg-muted transition-colors"
                    >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </CardHeader>

            {data?.name ? (
                <CardContent className="p-4 pt-0 space-y-4">
                    <div className="flex flex-col">
                        <div className="font-semibold text-base">{data?.name}</div>
                        <div className="text-xs text-muted-foreground">{data?.description}</div>
                    </div>

                    <div className="flex items-center justify-between">
                        <a
                            href={`${MARKETPLACE_URL_PREFIX}/${data.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-sm max-w-[200px] text-primary flex items-center gap-1"
                        >
                            <span>
                                <Link className="h-3 w-3" />
                            </span>
                            <span>{data.slug}</span>
                        </a>
                    </div>

                    {data.selectedAction?.inputs && (
                        <div className="space-y-2">
                            {Object.entries(data.selectedAction.inputs).map(([key, input]) => (
                                <div key={key}>
                                    <Label className="text-xs">
                                        {input.name}
                                        {input.required && (
                                            <span className="text-destructive">*</span>
                                        )}
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder={input.description}
                                        className="h-8 text-xs"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            ) : (
                <CardContent className="p-4 pt-0 space-y-4"></CardContent>
            )}

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="!bg-muted-foreground"
            />
        </Card>
    );
}
