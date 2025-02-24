import APIClient from 'utils/ts/apiClient';
import {
  GradesByCourseType,
  GraduationAgreement,
  GraduationExcelUpload,
} from './APIDetail';

export const agreeGraduationCredits = APIClient.of(GraduationAgreement);

export const uploadGraduationExcel = APIClient.of(GraduationExcelUpload);

export const calculateGraduationCredits = APIClient.of(GradesByCourseType);
