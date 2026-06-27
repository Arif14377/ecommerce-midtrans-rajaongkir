export interface NotificationPayload {
  order_id: string;
  customer: string;
  total_price: number;
  status: string;
}

export interface WebSocketMessage {
  type: string;
  payload: NotificationPayload;
}

export interface Notification extends NotificationPayload {
  id: string;
  read: boolean;
  createdAt: Date;
}