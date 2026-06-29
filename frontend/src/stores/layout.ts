import { create } from 'zustand';
import type { LayoutState } from '../types';

export const useLayoutState = create<LayoutState>((set)=>({
    sidebarOpen: false,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    toggleSidebar: () => set((state)=>({ sidebarOpen: !state.sidebarOpen })),
    setMobile: (isMobile) => set({ isMobile }),
    isDrawerOpen: false,
    toggleDrawer: () => set((state)=>({ isDrawerOpen: !state.isDrawerOpen })),
    closeDrawer: () => set({ isDrawerOpen: false }),
}));