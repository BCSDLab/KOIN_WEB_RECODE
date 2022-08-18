import { APIResponse } from 'api/interfaces/APIResponse';

export type LoginRequest = {
  portal_account: string
  password: string
};

export interface LoginResponse extends APIResponse {}
