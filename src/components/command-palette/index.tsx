'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { v4 } from "uuid";

import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loading-spinner";
import { useApi } from "@/hooks/useApi";
import { getActionYAMLInputs } from "@/lib/github";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/stores/workflow-store";


export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [actionList, setActionList] = useState<any[]>([]);
    const [filteredActionList, setFilteredActionList] = useState<any[]>([]); // Added filtered list state
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // To manage infinite scroll loading
    const [page, setPage] = useState(1);
    const { apiCall } = useApi();

    const { addNode } = useWorkflowStore()

    // Toggle open state with "k" key press
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Function to fetch data with pagination and query parameters
    const getActionList = async (queryParams: Record<string, string>) => {
        setLoading(true);

        const queryString = '?' + new URLSearchParams(queryParams).toString();
        const { success, response, message } = await apiCall({
            url: `/api/github/actions${queryString}`,
            type: 'GET',
        });

        if (success) {
            // If the first page, reset the list, otherwise append the next data
            setActionList((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
            console.log('response.data.currentPage <= response.data.totalPages', response.currentPage, response.totalPages, response.currentPage <= response.totalPages)
            setHasMore(response.currentPage <= response.totalPages); // If no data returned, stop infinite scroll
        } else {
            console.error(message); // Log error message if the API call fails
        }

        setLoading(false);
    };

    // Fetch first page of data when the palette is opened or on query change
    useEffect(() => {
        if (open) {
            getActionList({ query, page: String(page) });
        }
    }, [open, query, page]);

    // Function to remove items with duplicate IDs
    const removeDuplicateItems = (list: any[]) => {
        const seen = new Set();
        return list.filter(item => {
            if (seen.has(item.id)) {
                return false; // If the ID has already been seen, skip this item
            }
            seen.add(item.id); // Otherwise, mark the ID as seen
            return true;
        });
    };

    // Use this function to filter out duplicates after fetching data
    useEffect(() => {
        if (query.trim()) {
            const filtered = actionList.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
            const uniqueFiltered = removeDuplicateItems(filtered); // Remove duplicates based on ID
            setFilteredActionList(uniqueFiltered);
        } else {
            const uniqueActions = removeDuplicateItems(actionList); // Remove duplicates if query is empty
            setFilteredActionList(uniqueActions);
        }
    }, [query, actionList]);

    // Handle the search input change
    const handleSearch = (query: string) => {
        setPage(1); // Reset to first page on query change
        // setActionList([]); // Clear action list on query change
        setHasMore(true); // Reset hasMore to true when search changes
        setQuery(query);
    };

    // Handle the command item selection
    const handleSelect = async (item: any) => {
        console.log(item);
        setIsActionLoading(true);
        const repoPath = "https://github.com/" + item.externalUsesPathPrefix.replace("@", "")
        const actionInputs = await getActionYAMLInputs(item.ownerLogin, item.externalUsesPathPrefix.substring(
            item.externalUsesPathPrefix.indexOf("/") + 1,
            item.externalUsesPathPrefix.lastIndexOf("@"),
        ), "")
        const position = { x: Math.random() * 100, y: Math.random() * 100 };

        const nodeId = v4();

        addNode({
            position,
            id: nodeId,
            data: {
                nodeId,
                ...item,
                actionInputs,
                repoPath,
            },
            type: 'action',
        })
        setIsActionLoading(false);

        console.log("%c repoPath>>>", "color: red; background: limegreen; padding: 6px", actionInputs, repoPath);
        setOpen(false);
    };

    // Infinite scroll loading more data when user scrolls
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollableElement = e.currentTarget;
        const bottom = scrollableElement.scrollHeight - scrollableElement.scrollTop <= scrollableElement.clientHeight + 5;

        // If we're near the bottom (within 5px) and there are more items to load, trigger the loading
        if (bottom && hasMore && !loading) {
            setPage((prev) => prev + 1); // Load next page
        }
    };




    return (
        <>
            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                filter={(value, search) => {
                    if (value.includes(search)) return 1
                    return 0
                }}
                className={cn(
                    "fixed inset-0 z-50 flex items-center justify-center",
                    "bg-foreground/15"
                )}
            >
                <div className="w-full max-w-lg p-2 bg-card relative rounded-xl shadow-sm">
                    <Input
                        className="w-full p-2 text-sm text-foreground border border-border rounded-md focus:outline-none"
                        placeholder="Search for GitHub actions..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {isActionLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                            <Loader className="text-primary h-6" />
                        </div>
                    )}
                    <Command.List
                        className="mt-2 overflow-y-auto max-h-96"
                        onScroll={handleScroll} // Adding infinite scroll
                    >

                        {loading && (
                            <Command.Empty className="py-2 text-sm text-muted-foreground">
                                Loading...
                            </Command.Empty>
                        )}
                        {!loading && actionList.length === 0 && (
                            <Command.Empty className="py-2 text-sm text-muted-foreground">
                                No results found.
                            </Command.Empty>
                        )}
                        <Command.Group>
                            {filteredActionList && filteredActionList.map((item, index) => (
                                <Command.Item
                                    key={item.id}
                                    className={cn(
                                        "flex items-center p-2 text-sm rounded-md cursor-pointer",
                                        "hover:bg-secondary hover:text-secondary-foreground",
                                        "aria-selected:bg-secondary aria-selected:text-secondary-foreground"
                                    )}
                                    onSelect={() => handleSelect(item)}
                                >
                                    <div className="flex gap-2 items-center">

                                        <span
                                            className={cn(
                                                " inline-block rounded-md p-2 h-10 w-10 text-white [&>svg]:h-6 [&>svg]:w-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]",
                                                "bg-[#" + item.color + "]" // Use the color from the API response for the background
                                            )}
                                            style={{ backgroundColor: `#${item.color}` }}
                                            dangerouslySetInnerHTML={{
                                                __html: item.iconSvg
                                            }}
                                        />
                                        <span className="flex flex-col">
                                            <span className="text-md font-bold">
                                                {item.name}
                                            </span>
                                            <span className="text-foreground">
                                                {item.description}
                                            </span>
                                        </span>
                                    </div>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    </Command.List>
                    <div className="mt-2 flex justify-end items-center border-t pt-1 text-primary">


                        <div className="flex items-center gap-2 text-sm h-6">
                            Add action to board
                            <kbd>↵</kbd>
                        </div>
                    </div>
                </div>
            </Command.Dialog>
        </>
    );
}
