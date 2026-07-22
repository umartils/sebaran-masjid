import { apiClient } from "./client";

import { PengajuanMasjid } from "../validation";

export type PengajuanResponse = {
    id: string;
    nama: string;
    alamat: string;
};

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export async function createPengajuan(
    data: PengajuanMasjid
){
    return apiClient<ApiResponse<PengajuanResponse>>(
        "/api/pengajuan",
        {
            method:"POST",
            body: JSON.stringify(data)
        }
    );
}

export async function updatePengajuan(
    data: PengajuanMasjid
){
    return apiClient<ApiResponse<PengajuanResponse>>(
        "/api/pengajuan",
        {
            method:"PUT",
            body: JSON.stringify(data)
        }
    );
}