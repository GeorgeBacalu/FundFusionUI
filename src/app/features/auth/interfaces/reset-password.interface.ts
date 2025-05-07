export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmedPassword: string;
}