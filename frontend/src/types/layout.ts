export interface LayoutState {
    sidebarOpen: boolean;
    isMobile: boolean;
    toggleSidebar: () => void;
    setMobile: (isMobile: boolean) => void;

    isDrawerOpen: boolean;
    toggleDrawer: () => void;
    closeDrawer: () => void;
}