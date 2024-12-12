'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

export function CommandPalette() {
    const [open, setOpen] = useState(false);

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

    const handleSelect = (message: string) => {
        console.log(message);
        setOpen(false);
    };

    return (
        <>
            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                className={cn(
                    "fixed inset-0 z-50 flex items-center justify-center",
                    "bg-foreground/15"
                )}
            >
                <div className="w-full max-w-lg p-2 bg-card rounded-lg shadow-sm">
                    <Command.Input
                        className="w-full p-2 text-lg text-foreground bg-input border border-border rounded-md focus:outline-none"
                        placeholder="Search for github actions..."
                    />
                    <Command.List className="mt-2">
                        {/* <Command.Loading>Hang on…</Command.Loading> */}
                        <Command.Empty className="py-2 text-sm text-muted-foreground">
                            No results found.
                        </Command.Empty>
                        <Command.Group>
                            <Command.Item
                                className={cn(
                                    "flex items-center p-2 py-3 text-sm rounded-md cursor-pointer",
                                    "hover:bg-secondary hover:text-secondary-foreground",
                                    "aria-selected:bg-secondary aria-selected:text-secondary-foreground"
                                )}
                                onSelect={() => handleSelect("Command 1 selected")}
                            >
                                Command 1
                            </Command.Item>
                            <Command.Item
                                className={cn(
                                    "flex items-center p-2 py-3 text-sm rounded-md cursor-pointer",
                                    "hover:bg-secondary hover:text-secondary-foreground",
                                    "aria-selected:bg-secondary aria-selected:text-secondary-foreground"
                                )}
                                onSelect={() => handleSelect("Command 2 selected")}
                            >
                                Command 2
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </div>
            </Command.Dialog>
        </>
    );
}
