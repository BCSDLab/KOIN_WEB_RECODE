import APIClient from 'utils/ts/apiClient';
import {
  LectureList,
  SemesterInfoList,
  TimetableAddLecture,
  TimetableInfo,
  TimetableRemoveLecture,
} from './APIDetail';

export const getLectureList = APIClient.of(LectureList);

export const getSemesterInfoList = APIClient.of(SemesterInfoList);

export const getTimeTableInfo = APIClient.of(TimetableInfo);

export const changeTimeTableInfoByAddLecture = APIClient.of(TimetableAddLecture);

export const changeTimeTableInfoByRemoveLecture = APIClient.of(TimetableRemoveLecture);
