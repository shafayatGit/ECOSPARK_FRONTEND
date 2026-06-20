export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    redirect: boolean;
    user: {
      needPasswordChange: boolean;
      email: string;
      name: string;
      role: string;
      image: string;
      status: string;
      isDeleted: boolean;
      emailVerified: boolean;
    };
  };
}
