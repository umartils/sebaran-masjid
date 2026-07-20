// lib/api/progres.ts

import { apiClient } from "./client";

import {
    CreateProgresInput,
    UpdateProgresInput
} from "@/lib/validation";

export type ProgressResponse = {
    id: string;
    trackingId: string;
    persentase: number;
};

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export async function createProgres(
    data: CreateProgresInput
){
    return apiClient<ApiResponse<ProgressResponse>>(
        "/api/progres",
        {
            method:"POST",
            body: JSON.stringify(data)
        }
    );
}

export async function updateProgres(
    data: UpdateProgresInput
){
    return apiClient<ApiResponse<ProgressResponse>>(
        "/api/progres",
        {
            method:"PUT",
            body: JSON.stringify(data)
        }
    );
}