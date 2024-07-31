import APIClient from 'utils/ts/apiClient';
import {
  LectureList,
  SemesterInfoList,
  TimetableAddLecture,
  TimetableInfo,
  TimetableRemoveLecture,
  VersionInfo,
  SemesterCheck,
  TimetableFrameList,
  AddTimetableFrame,
  UpdateTimetableFrame,
  DeleteTimetableFrame,
} from './APIDetail';

export const getLectureList = APIClient.of(LectureList);

export const getSemesterInfoList = APIClient.of(SemesterInfoList);

export const getTimetableInfo = APIClient.of(TimetableInfo);

export const changeTimetableInfoByAddLecture = APIClient.of(TimetableAddLecture);

export const changeTimetableInfoByRemoveLecture = APIClient.of(TimetableRemoveLecture);

export const getVersion = APIClient.of(VersionInfo);

export const getMySemester = APIClient.of(SemesterCheck);

export const getTimetableFrame = APIClient.of(TimetableFrameList);

export const addTimetableFrame = APIClient.of(AddTimetableFrame);

export const updateTimetableFrame = APIClient.of(UpdateTimetableFrame);

export const deleteTimetableFrame = APIClient.of(DeleteTimetableFrame);
