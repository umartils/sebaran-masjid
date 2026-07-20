import { ApiError } from "./client";

export async function executeRequest<T>(
    request: Promise<T>,
    showToast: (
        message: string,
        type: "success" | "error"
    ) => void
){
    try {

        const result = await request;

        // asumsi response memiliki message
        const data = result as {
            message: string;
        };

        showToast(data.message, "success");

        return data;

    } catch (err) {

        if (err instanceof ApiError) {
            showToast(err.message, "error");
        } else {
            showToast("Terjadi kesalahan", "error");
        }

        return null;
    }
}