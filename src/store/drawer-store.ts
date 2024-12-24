// src/store/workflow-store.ts
import { create } from 'zustand';


interface DrawerState {
    isActionConfigureDrawerOpen: boolean;
    openActionConfigureDrawer: (action: any) => void;
    closeActionConfigureDrawer: () => void;
    actionData?: any;
}


export const useDrawerStore = create<DrawerState>((set, get) => ({
    isActionConfigureDrawerOpen: false,
    actionData: undefined,
    openActionConfigureDrawer: (action: any) => {
        set({ isActionConfigureDrawerOpen: true, actionData: action });
    },
    closeActionConfigureDrawer: () => {
        set({ isActionConfigureDrawerOpen: false });
    },
}));