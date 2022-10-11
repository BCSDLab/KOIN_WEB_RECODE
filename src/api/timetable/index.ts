import { APIClient } from 'utils/ts/apiClient';
import {
  LectureList,
  SemesterInfoList,
} from './APIDetail';

export const getLectureList = APIClient.of(LectureList);

export const getSemesterInfoList = APIClient.of(SemesterInfoList);
