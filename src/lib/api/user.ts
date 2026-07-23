// lib/api/user.ts

import { apiClient } from "./client";

import {
    AddUserInput,
    UpdateUserInput
} from "@/lib/validation";

export type UserResponse = {
    id: string;
    name: string;
    email: string;
};

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export async function addUserApi(
    data: AddUserInput
){
    return apiClient<ApiResponse<UserResponse>>(
        "/api/user",
        {
            method:"POST",
            body: JSON.stringify(data)
        }
    );
}

export async function updateUserApi(
    data: UpdateUserInput
){
    return apiClient<ApiResponse<UserResponse>>(
        "/api/user",
        {
            method:"PUT",
            body: JSON.stringify(data)
        }
    );
}