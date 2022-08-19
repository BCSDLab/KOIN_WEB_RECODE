import { APIResponse } from 'api/interfaces/APIResponse';

export type LoginRequest = {
  portal_account: string
  password: string
};

export interface LoginResponse extends APIResponse {
  token: string
  ttl: number
  user:{
    accountNonExpired : boolean
    accountNonLocked: boolean
    anonymous_nickname: string
    credentialsNonExpired: boolean
    enabled: boolean
    gender: number
    id: number
    identity: number
    is_graduated: false
    major: string
    name: string
    nickname: string
    portal_account: string
    student_number: string
    username: string
  }
}

export interface RefreshResponse extends APIResponse { }
