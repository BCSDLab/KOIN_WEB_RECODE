import { APIResponse } from "api/interfaces/APIResponse"

export type LoginRequest = {
    userId: string
    password: string
}

export interface LoginResponse extends APIResponse {}