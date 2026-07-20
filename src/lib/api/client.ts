// lib/api/client.ts

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.message ?? "Terjadi kesalahan",
      response.status
    );
  }

  return result;
}