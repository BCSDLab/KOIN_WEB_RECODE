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

export interface SignupResponse extends APIResponse { }

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse extends APIResponse {
  token: string;
  refresh_token: string;
}
