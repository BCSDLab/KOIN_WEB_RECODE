import { APIResponse } from 'interfaces/APIResponse';

export type LoginRequest = {
  login_id: string;
  login_pw: string;
};

export type LoginStudentRequest = {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  department: string;
  student_number: string;
  gender: string;
  email: string | null;
  nickname: string | null;
};

export type LoginGeneralRequest = {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  gender: string;
  email: string | null;
  nickname: string | null;
  marketing_notification_agreement: boolean;
};

export interface LoginResponse extends APIResponse {
  token: string;
  refresh_token: string;
  user_type: 'STUDENT' | 'GENERAL';
}

export interface NicknameDuplicateCheckResponse extends APIResponse {
  success: string;
}

export interface EmailDuplicateCheckResponse extends APIResponse {
  success: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  // options
  name?: string;
  nickname?: string;
  gender?: number;
  major?: string;
  student_number?: string;
  phone_number?: string;
  is_graduated?: boolean;
}

export interface FindPasswordRequest {
  email: string;
}

export interface CheckPasswordRequest {
  password: string;
}

export interface SignupStudentResponse extends APIResponse { }

export interface SignupGeneralResponse extends APIResponse { }

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse extends APIResponse {
  token: string;
  refresh_token: string;
}

export interface UserResponse extends APIResponse {
  id: number;
  login_id: string;
  anonymous_nickname: string;
  login_id: string;
  email: string;
  gender: 0 | 1;
  major: string; // 학부
  name: string;
  nickname: string;
  phone_number: string;
  student_number: string;
  user_type: 'STUDENT';
}

export interface GeneralUserResponse extends APIResponse {
  id: number;
  login_id: string;
  email: string;
  gender: 0 | 1;
  name: string;
  nickname: string;
  phone_number: string;
  user_type: 'GENERAL';
}

export interface UserAcademicInfoResponse extends APIResponse {
  id: number;
  anonymous_nickname: string;
  email: string;
  gender: 0 | 1;
  department: string; // 학부
  major: string; // 세부 전공
  name: string;
  nickname: string;
  phone_number: string;
  student_number: string;
}

export interface UserUpdateRequest {
  password?: string;
  gender?: 0 | 1;
  major?: string;
  name?: string;
  nickname?: string;
  phone_number?: string;
  student_number?: string;
  email?: string;
}

export interface GeneralUserUpdateRequest {
  gender?: 0 | 1;
  name?: string;
  nickname?: string;
  phone_number?: string;
  email?: string;
  password?: string;
}

export interface DeleteResponse extends APIResponse { }

export interface CheckIdResponse extends APIResponse { }

export interface FindPasswordResponse extends APIResponse {
  code: number;
  message: string;
}

export interface CheckPasswordResponse extends APIResponse { }

export interface UpdateAcademicInfoRequest extends APIResponse {
  student_number: string;
  department: string;
  major?: string;
}

export interface UpdateAcademicInfoResponse extends APIResponse {
  student_number: string;
  department: string;
  major: string | null;
}

export interface CheckPhoneResponse extends APIResponse { }
export interface SmsSendResponse extends APIResponse {
  target: string;
  total_count: number;
  remaining_count: number;
  current_count: number;
}
export interface SmsVerifyResponse extends APIResponse { }

export interface SmsSendRequest {
  phone_number: string;
}

export interface SmsVerifyRequest {
  phone_number: string;
  verification_code: string;
}

export interface EmailExistsRequest {
  email: string;
}

export interface EmailExistsResponse extends APIResponse { }
export interface VerificationEmailSendResponse extends APIResponse {
  target: string;
  total_count: number;
  remaining_count: number;
  current_count: number;
}

export interface VerificationEmailSendRequest {
  email: string;
}

export interface VerificationEmailVerifyRequest {
  email: string;
  verification_code: string;
}

export interface VerificationEmailVerifyResponse extends APIResponse { }

export interface IdFindEmailRequest {
  email: string;
  verification_code: string;
}

export interface IdFindEmailResponse extends APIResponse {
  login_id: string;
}

export interface PhoneExistsRequest {
  phone_number: string;
}

export interface PhoneExistsResponse extends APIResponse { }

export interface IdExistsRequest {
  login_id: string;
}

export interface IdExistsResponse extends APIResponse { }

export interface IdMatchPhoneRequest {
  login_id: string;
  phone_number: string;
}

export interface IdMatchPhoneResponse extends APIResponse { }

export interface IdMatchEmailRequest {
  login_id: string;
  email: string;
}

export interface IdMatchEmailResponse extends APIResponse { }

export interface ResetPasswordSmsRequest {
  login_id: string;
  phone_number: string;
  new_password: string;
}

export interface ResetPasswordSmsResponse extends APIResponse { }

export interface ResetPasswordEmailRequest {
  login_id: string;
  email: string;
  new_password: string;
}

export interface ResetPasswordEmailResponse extends APIResponse { }

export interface VerificationSmsSendResponse extends APIResponse {
  target: string;
  total_count: number;
  remaining_count: number;
  current_count: number;
}

export interface VerificationSmsSendRequest {
  phone_number: string;
}

export interface VerificationSmsVerifyResponse extends APIResponse { }

export interface VerificationSmsVerifyRequest {
  phone_number: string;
  verification_code: string;
}

export interface IdFindSmsResponse extends APIResponse {
  login_id: string;
}

export interface IdFindSmsRequest {
  phone_number: string;
  verification_code: string;
}
