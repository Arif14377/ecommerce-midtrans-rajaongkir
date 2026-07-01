import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import type { RegisterRequest } from "../../types";
import type { SuccessResponse, ApiError } from "../../types";
import toast from "react-hot-toast";

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await Api.post<SuccessResponse<null>>(
                'api/register',
                data
            );
            return response.data
        },

        onSuccess: (response) => {
            toast.success(
                response.message || 'Registrasi berhasil! Silahkan login.'
            );
        },

        onError: (error: ApiError) => {
            if (!error.response?.data?.errors) {
                toast.error(
                    error.response?.data?.message || 'Registrasi gagal.'
                );
            }
        }
    });
};