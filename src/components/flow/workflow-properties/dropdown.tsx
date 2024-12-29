"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useController, Control } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type BranchVersionData = {
    versions: string[];
    branches: string[];
};

interface BranchVersionDropdownProps {
    data: BranchVersionData;
    control: Control<any>;
    name: string;
    id: string;
}

export function BranchVersionDropdown({ data, control, name, id }: BranchVersionDropdownProps) {
    const {
        field: { onChange, value },
        fieldState: { error }
    } = useController({
        name,
        control,
        rules: { required: "Please select a branch/version" },
    })

    const [searchTerm, setSearchTerm] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const filterItems = (items: string[]) => {
        return items.filter(item =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const renderGroup = (label: string, items: string[]) => {
        const filteredItems = filterItems(items)
        if (filteredItems.length === 0) return null

        return (
            <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground py-[2px]">{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="px-2">
                    {filteredItems.map((item) => (
                        <DropdownMenuItem
                            key={item}
                            className="focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-0"
                            onSelect={() => {
                                onChange(item)
                                setOpen(false)
                            }}
                        >
                            {item}
                            {value === item && (
                                <Check className="ml-auto h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </>
        )
    }

    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between truncate text-left relative"
                        id={id}
                        name={name}
                    >
                        {value || <span className="text-muted-foreground font-normal">Select branch/version</span>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px]">
                    <div className="p-2">
                        <div className="flex items-center border rounded-md">
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            <Input
                                placeholder="Search versions or branches"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-y-auto">
                        {renderGroup("Versions", data.versions)}
                        {renderGroup("Branches", data.branches)}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
        </div>
    )
}

