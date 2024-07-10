import APIClient from 'utils/ts/apiClient';
import {
  LectureList,
  SemesterCheckInfo,
  SemesterInfoList,
  TimetableAddLecture,
  TimetableInfo,
  TimetableRemoveLecture,
  VersionInfo,
} from './APIDetail';

export const getLectureList = APIClient.of(LectureList);

export const getSemesterInfoList = APIClient.of(SemesterInfoList);

export const getSemestersCheck = APIClient.of(SemesterCheckInfo);

export const getTimetableInfo = APIClient.of(TimetableInfo);

export const changeTimetableInfoByAddLecture = APIClient.of(TimetableAddLecture);

export const changeTimetableInfoByRemoveLecture = APIClient.of(TimetableRemoveLecture);

export const getVersion = APIClient.of(VersionInfo);
