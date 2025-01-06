import { create } from "zustand";

interface AuthLayoutState {
    title: string;
    subtitle?: string;
    illustration?: string;
    setTitle: (title: string) => void;
    setSubtitle: (subtitle: string) => void;
    setIllustration: (illustration: string) => void;
}

export const useAuthLayoutStore = create<AuthLayoutState>((set) => ({
    title: "Login",
    subtitle: "Sign in to your account",
    illustration: "/placeholder.svg?height=400&width=400",
    setTitle: (title) => set({ title }),
    setSubtitle: (subtitle) => set({ subtitle }),
    setIllustration: (illustration) => set({ illustration }),
}));
