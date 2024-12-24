"use client"

import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/drawer-sheet"

interface DynamicSideDrawerProps {
    isOpen: boolean
    onClose: () => void
    title: string
    subtitle?: string
    body: React.ReactNode
    stickyButtons: React.ReactNode
}

export function DynamicSideDrawer({
    isOpen,
    onClose,
    title,
    subtitle,
    body,
    stickyButtons
}: DynamicSideDrawerProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col px-4 pb-2">
                <SheetHeader className="px-1">
                    <SheetTitle>{title}</SheetTitle>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </SheetHeader>
                <div className="flex-grow overflow-y-auto py-4 px-1">
                    {body}
                </div>
                <div className="sticky bottom-0 bg-background pt-2 border-t">
                    {stickyButtons}
                </div>
            </SheetContent>
        </Sheet>
    )
}

