import APIClient from 'utils/ts/apiClient';
import {
  GraduationAgreement,
  GraduationExcelUpload,
} from './APIDetail';

export const agreegraduationCredits = APIClient.of(GraduationAgreement);

export const uploadGraduationExcel = APIClient.of(GraduationExcelUpload);
