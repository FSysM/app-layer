export type AuthUser = { id: string; username: string; role: string };
export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
