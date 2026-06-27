export interface SuccessResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiError {
    response?: {
        data?: {
            success?: boolean;
            message?: string;
            errors?: Record<string, string[]>;
        };
        status?: number;
    };
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: {
        current_page: number;
        data: T;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export interface MetaPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}