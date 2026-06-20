import { httpClient } from "@/lib/axios/httpClient";

interface ICreateSubscription {
  email: string;
}

interface IResponseSubscription {
  id: string;
  email: string;
  isActive: true;
  subscribedAt: string;
}
export async function createComment(payload: ICreateSubscription) {
  try {
    return await httpClient.post<IResponseSubscription>(
      "/api/newsletter/subscribe",
      payload,
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to post comment.",
      data: null,
    };
  }
}
