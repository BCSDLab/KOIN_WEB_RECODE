import APIClient from 'utils/ts/apiClient';
import {
  GradesByCourseType,
  GraduationAgreement,
  GeneralEducation,
  CourseType,
  GraduationExcelUpload,
} from './APIDetail';

export const agreeGraduationCredits = APIClient.of(GraduationAgreement);

export const uploadGraduationExcel = APIClient.of(GraduationExcelUpload);

export const calculateGraduationCredits = APIClient.of(GradesByCourseType);

export const getGeneralEducation = APIClient.of(GeneralEducation);

export const getCourseType = APIClient.of(CourseType);
