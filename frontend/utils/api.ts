export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const NETWORK_ERROR = "Impossible de joindre la librairie pour le moment, réessayez dans un instant.";

// Every backend answer has this shape: on success the extra fields (books, events…) are there, on failure an error
export type ApiResult<T> = ({ result: true } & T) | { result: false; error: string };

// Returns null when the backend can't be reached at all (server down, no network)
export async function apiRequest<T>(path: string, method = "GET", body?: object): Promise<ApiResult<T> | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    return (await response.json()) as ApiResult<T>;
  } catch {
    return null;
  }
}
