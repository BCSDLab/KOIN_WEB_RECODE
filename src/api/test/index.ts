import APIClient from 'utils/ts/apiClient';
import { ABTestAssign, GetMyABTest } from './APIDetail';

export const abTestAssign = APIClient.of(ABTestAssign);
export const getMyABTest = APIClient.of(GetMyABTest);
