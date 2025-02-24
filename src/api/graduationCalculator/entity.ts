import { APIResponse } from 'interfaces/APIResponse';

export interface GraduationAgree extends APIResponse { }

export interface GraduationExcelUploadResponse extends APIResponse { }

export interface GraduationExelUploadRequest {
  file: File;
}

export type GradesByCourseType = {
  courseType: string;
  requiredGrades: number;
  grades: number;
};

export interface GradesByCourseTypeResponse {
  course_types: GradesByCourseType[];
}
