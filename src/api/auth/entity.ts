import { APIResponse } from 'interfaces/APIResponse';

export type LoginRequest = {
  email: string;
  password: string;
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

export interface SignupResponse extends APIResponse { }

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse extends APIResponse {
  token: string;
  refresh_token: string;
}

export interface UserResponse extends APIResponse {
  anonymous_nickname: string;
  email: string;
  gender: 0 | 1;
  major: string;
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

export interface FindPasswordResponse extends APIResponse {
  code: number;
  message: string;
}

export interface CheckPasswordResponse extends APIResponse { }
