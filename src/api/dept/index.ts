import APIClient from 'utils/ts/apiClient';
import { DeptList, DeptMajorList } from './APIDetail';

export const getDeptList = APIClient.of(DeptList);

export const getDeptMajorList = APIClient.of(DeptMajorList);
