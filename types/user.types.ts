import { UserRole } from "@/lib/authUtils";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}
