import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '../types/notification';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;

    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    clearReadNotifications: () => void;
    setConnected: (connected: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            notifications: [],
            unreadCount: 0,
            isConnected: false,

            addNotification: (notification) =>
                set((state) => {
                    const exists = state.notifications.some((n) => n.id === notification.id);
                    if (exists) {
                        return state
                    }
                    return {
                        notifications: [notification, ...state.notifications].slice(0, 20),
                        unreadCount: state.unreadCount + 1
                    };
                }),

            markAsRead: (id) =>
                set((state) => {
                    const notification = state.notifications.find((n) => n.id ===id);
                    const shouldDecrease = notification && !notification.read;
                    return{
                        notifications: state.notifications.map((n) =>
                            n.id === id ? {...n, read: true} : n
                        ),
                        unreadCount: shouldDecrease
                            ? Math.max(0, state.unreadCount - 1)
                            : state.unreadCount,
                    };
                }),

            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                })),

            clearNotifications: () =>
                set({
                    notifications: [],
                    unreadCount: 0,
                }),

            clearReadNotifications: () =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => !n.read),
                })),

            setConnected: (connected) =>
                set({ isConnected: connected }),
        }),
        {
            name: 'notification-storage',
            partialize: (state) => ({
                notifications: state.notifications,
                unreadCount: state.unreadCount,
            }),
        }
    )
);