"use client"

import { useState } from "react";

interface ToastState {
    show: boolean;
    type: "success" | "error";
    message: string;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState>({
        show: false,
        type: "success",
        message: "",
    });

    function showToast(message: string, type: "success" | "error" = "success") {
        setToast({
            show: true,
            type,
            message,
        });

        setTimeout(() => {
            setToast((prev) => ({
            ...prev,
            show: false,
            }));
        }, 3000);
    }

    return { toast, showToast };
}