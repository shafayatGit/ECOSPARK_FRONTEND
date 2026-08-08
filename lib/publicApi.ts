type PublicQueryValue = string | number | boolean | null | undefined;

interface CachedPublicRequestOptions {
  params?: Record<string, PublicQueryValue>;
  revalidate?: number;
}

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!PUBLIC_API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function fetchCachedPublicApi<T>(
  path: string,
  options: CachedPublicRequestOptions = {},
): Promise<T> {
  const url = new URL(path, PUBLIC_API_BASE_URL);

  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    next: {
      revalidate: options.revalidate ?? 600,
    },
  });

  const body = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(body?.message || "Failed to fetch public data.");
  }

  return body;
}
