import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { useAuthStore } from "../../stores/auth";
import type {
    LoginRequest,
    LoginResponse
} from '../../types/auth';
import type {
    SuccessResponse,
    ApiError
} from '../../types/api';
import toast from 'react-hot-toast';

export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth)

    return useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await Api.post<SuccessResponse<LoginResponse>>(
                '/api/login',
                credentials
            );
            return response.data;
        },
        
        onSuccess: (response) => {
            setAuth(response.data);

            toast.success('Login berhasil.');
        },

        onError: (error: ApiError) => {
            if (!error.response?.data?.errors) {
                toast.error(error.response?.data?.message || 'Login gagal');
            }
        }
    });
};