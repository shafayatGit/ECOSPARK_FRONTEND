import { UserRole } from "@/lib/authUtils";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
