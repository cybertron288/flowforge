// src/store/workflow-store.ts
import { getAllVersions } from "@/lib/github";
import { create } from 'zustand';


interface DrawerState {
    isActionConfigureDrawerOpen: boolean;
    openActionConfigureDrawer: (action: any) => void;
    closeActionConfigureDrawer: () => void;
    actionData?: any;
    workflowVersionsAndBranches?: any;
    isActionDataLoading: boolean
}


export const useDrawerStore = create<DrawerState>((set, get) => ({
    isActionConfigureDrawerOpen: false,
    actionData: undefined,
    workflowVersionsAndBranches: undefined,
    isActionDataLoading: false,
    openActionConfigureDrawer: async (action: any) => {
        set({ isActionDataLoading: true });
        const workflowVersionsAndBranches = await getAllVersions(action.repoPath);
        set({ isActionDataLoading: false });
        set({ isActionConfigureDrawerOpen: true, actionData: action, workflowVersionsAndBranches });
    },
    closeActionConfigureDrawer: () => {
        set({ isActionConfigureDrawerOpen: false });
    },
}));