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

export interface UserProfile extends Omit<UserInfo, "image"> {
  image?: string | null;
  emailVerified: boolean;
  needPasswordChange: boolean;
  updatedAt: string;
}
