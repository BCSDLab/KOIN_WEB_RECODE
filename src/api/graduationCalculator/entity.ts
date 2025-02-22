import { APIResponse } from 'interfaces/APIResponse';

export interface GraduationAgree extends APIResponse { }

export interface GraduationExcelUploadResponse extends APIResponse { }

export interface GraduationExelUploadRequest {
  file: string
}
