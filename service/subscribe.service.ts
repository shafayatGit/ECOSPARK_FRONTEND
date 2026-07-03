/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

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

export async function subscribeToNewsletter(payload: ICreateSubscription) {
  try {
    const res = await httpClient.post<IResponseSubscription>(
      "/api/newsletter/subscribe",
      payload,
    );
    return {
      success: true,
      message: "Subscribed successfully!",
      data: res.data,
    };
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Failed to subscribe to newsletter.";
    return {
      success: false,
      message: errorMsg,
      data: null,
    };
  }
}
