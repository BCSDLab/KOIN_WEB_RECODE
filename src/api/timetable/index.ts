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
  TimetableLectureInfoV2,
  AddTimetableLectureV2,
  DeleteTimetableLectureV2,
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

export const getTimetableLectureInfoV2 = APIClient.of(TimetableLectureInfoV2);

export const changeTimetableInfoByAddLectureV2 = APIClient.of(AddTimetableLectureV2);

export const changeTimetableInfoByRemoveLectureV2 = APIClient.of(DeleteTimetableLectureV2);
