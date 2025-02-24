import APIClient from 'utils/ts/apiClient';
import {
  GraduationAgreement,
  GeneralEducation,
  CourseType,
} from './APIDetail';

export const calculateGraduationCredits = APIClient.of(GraduationAgreement);

export const getGeneralEducation = APIClient.of(GeneralEducation);

export const getCourseType = APIClient.of(CourseType);
