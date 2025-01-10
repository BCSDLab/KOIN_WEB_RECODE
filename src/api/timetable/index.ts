import APIClient from 'utils/ts/apiClient';
import {
  SemesterInfoList,
  SemesterCheck,
  LectureList,
  TimetableLectureInfo,
  TimetableLectureEdit,
  TimetableLectureAddition,
  TimetableLectureDeletion,
  TimetableFrameList,
  TimetableFrameAddition,
  TimetableFrameEdit,
  DeleteTimetableFrame,
  RollbackTimetableFrame,
  DeleteSemester,
  VersionInfo,
} from './APIDetail';

export const getSemesterInfoList = APIClient.of(SemesterInfoList);

export const getMySemester = APIClient.of(SemesterCheck);

export const getLectureList = APIClient.of(LectureList);

export const getTimetableLectureInfo = APIClient.of(TimetableLectureInfo);

export const editTimetableLecture = APIClient.of(TimetableLectureEdit);

export const changeTimetableInfoByAddLecture = APIClient.of(TimetableLectureAddition);

export const changeTimetableInfoByRemoveLecture = APIClient.of(TimetableLectureDeletion);

export const getTimetableFrame = APIClient.of(TimetableFrameList);

export const addTimetableFrame = APIClient.of(TimetableFrameAddition);

export const editTimetableFrame = APIClient.of(TimetableFrameEdit);

export const deleteTimetableFrame = APIClient.of(DeleteTimetableFrame);

export const rollbackTimetableFrame = APIClient.of(RollbackTimetableFrame);

export const deleteSemester = APIClient.of(DeleteSemester);

export const getVersion = APIClient.of(VersionInfo);
