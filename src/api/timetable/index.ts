import APIClient from 'utils/ts/apiClient';
import {
  LectureList,
  SemesterInfoList, TimetableInfo,
} from './APIDetail';

export const getLectureList = APIClient.of(LectureList);

export const getSemesterInfoList = APIClient.of(SemesterInfoList);

export const getTimeTableInfo = APIClient.of(TimetableInfo);
