import APIClient from 'utils/ts/apiClient';
import {
  LectureList,
  SemesterInfoList,
  TimetableAddLecture,
  TimetableInfo,
  TimetableRemoveLecture,
  LastUpdatedDate,
} from './APIDetail';

export const getLectureList = APIClient.of(LectureList);

export const getSemesterInfoList = APIClient.of(SemesterInfoList);

export const getTimetableInfo = APIClient.of(TimetableInfo);

export const changeTimetableInfoByAddLecture = APIClient.of(TimetableAddLecture);

export const changeTimetableInfoByRemoveLecture = APIClient.of(TimetableRemoveLecture);

export const getLastUpdatedDate = APIClient.of(LastUpdatedDate);
