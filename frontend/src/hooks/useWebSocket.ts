import { useNotificationStore } from '../stores/notification';
import { useAuthStore } from '../stores/auth';
import type { WebSocketMessage, Notification } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL;

class WebSocketManager {
    private ws: WebSocket | null = null;
    private isConnecting = false;

    connect(token: string) {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        if (!token) return;

        this.isConnecting = true;

        try {
            this.ws = new WebSocket(`${WS_URL}?role=admin`);

            this.ws.onopen = () => {
                this.isConnecting = false;
                useNotificationStore.getState().setConnected(true);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data: WebSocketMessage = JSON.parse(event.data);

                    if (data.type === 'new_order') {
                        const notification: Notification = {
                            id: data.payload.order_id,
                            order_id: data.payload.order_id,
                            customer: data.payload.customer,
                            total_price: data.payload.total_price,
                            status: data.payload.status,
                            read: false,
                            createdAt: new Date(),
                        };

                        useNotificationStore.getState().addNotification(notification);
                    }
                } catch (err) {
                    console.error('WebSocket parse error:', err);
                }
            };

            this.ws.onclose = () => {
                this.ws = null;
                this.isConnecting = false;
                useNotificationStore.getState().setConnected(false);

                const token = useAuthStore.getState().token;
                if (token) {
                    setTimeout(() => {
                        this.connect(token);
                    }, 5000);
                }
            };

            this.ws.onerror = () => {
                this.isConnecting = false;
            };
        } catch {
            this.isConnecting = false;
        }
    }

    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export const wsManager = new WebSocketManager();

export function useWebSocket() {
    const { token } = useAuthStore();

    if (token && !wsManager.isConnected()) {
        wsManager.connect(token);
    }

    return {
        isConnected: wsManager.isConnected(),
    };
}