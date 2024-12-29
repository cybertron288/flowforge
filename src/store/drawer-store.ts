// src/store/workflow-store.ts
import { getAllVersions } from "@/lib/github";
import { create } from 'zustand';


interface DrawerState {
    isActionConfigureDrawerOpen: boolean;
    openActionConfigureDrawer: (action: any) => void;
    closeActionConfigureDrawer: () => void;
    actionData?: any;
    workflowVersionsAndBranches?: any;
}


export const useDrawerStore = create<DrawerState>((set, get) => ({
    isActionConfigureDrawerOpen: false,
    actionData: undefined,
    workflowVersionsAndBranches: undefined,
    openActionConfigureDrawer: async (action: any) => {
        const workflowVersionsAndBranches = await getAllVersions(action.repoPath);
        set({ isActionConfigureDrawerOpen: true, actionData: action, workflowVersionsAndBranches });
    },
    closeActionConfigureDrawer: () => {
        set({ isActionConfigureDrawerOpen: false });
    },
}));