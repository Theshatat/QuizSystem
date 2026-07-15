export interface ILoginResponse {
  token: string;
  expiresIn: number;
}

export interface ILoginRequest {
  userName: string;
  password: string;
}