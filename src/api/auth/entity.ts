import { APIResponse } from 'interfaces/APIResponse';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginStudentRequest = {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  department: string;
  student_number: string;
  gender: string;
  email?: string;
  nickname: string;
};

export type LoginGeneralRequest = {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  gender: string;
  email: string;
  nickname: string;
};

export interface LoginResponse extends APIResponse {
  token: string;
  refresh_token: string;
  userType: 'STUDENT';
}

export interface NicknameDuplicateCheckResponse extends APIResponse {
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
  anonymous_nickname: string;
  email: string;
  gender: 0 | 1;
  major: string; // 학부
  name: string;
  nickname: string;
  phone_number: string;
  student_number: string;
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
  identity?: number;
  is_graduated?: boolean;
  gender?: 0 | 1;
  major?: string;
  name?: string;
  nickname?: string;
  phone_number?: string;
  student_number?: string;
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
