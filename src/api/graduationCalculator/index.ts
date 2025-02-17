import APIClient from 'utils/ts/apiClient';
import {
  GraduationAgreement,
} from './APIDetail';

export const calculateGraduationCredits = APIClient.of(GraduationAgreement);
