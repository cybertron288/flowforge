"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DynamicSideDrawer } from '@/components/dynamic-side-drawer'
import { useDrawerStore } from '@/store/drawer-store'

export default function ActionConfigure() {
    const { isActionConfigureDrawerOpen, closeActionConfigureDrawer, actionData } = useDrawerStore()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        // Handle form submission
        console.log('Form submitted')
        closeActionConfigureDrawer()
    }

    const drawerBody = (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                    id="message"
                    placeholder="Enter your message"
                    className="w-full min-h-[100px] p-2 border rounded"
                ></textarea>
            </div>

            {JSON.stringify(actionData)}

        </form>
    )

    const drawerButtons = (
        <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => closeActionConfigureDrawer()}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </div>
    )

    return (
        <DynamicSideDrawer
            isOpen={isActionConfigureDrawerOpen}
            onClose={() => closeActionConfigureDrawer()}
            title="Setup Github Action"
            subtitle="Please fill out the form below to get in touch with us."
            body={drawerBody}
            stickyButtons={drawerButtons}
        />
    )
}

