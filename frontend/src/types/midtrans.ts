export interface MidtransResult {
  status_code?: string;
  status_message?: string;
  transaction_id?: string;
  order_id?: string;
  payment_type?: string;
}

export interface MidtransSnap {
  pay: (token: string, options: {
    onSuccess: (result?: MidtransResult) => void;
    onPending: (result?: MidtransResult) => void;
    onError: (result?: MidtransResult) => void;
    onClose?: () => void;
  }) => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}

export { };