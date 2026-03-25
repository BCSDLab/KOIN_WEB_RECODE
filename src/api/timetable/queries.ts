import { queryOptions } from '@tanstack/react-query';
import { Semester, TimetableFrameListResponse, VersionType } from './entity';
import {
  getLectureList,
  getMySemester,
  getSemesterInfoList,
  getTimetableAllLectureInfo,
  getTimetableFrame,
  getTimetableLectureInfo,
  getVersion,
} from './index';

const MY_SEMESTER_INFO_KEY = 'my_semester';
const SEMESTER_INFO_KEY = 'semester';
const LECTURE_LIST_KEY = 'lecture';
const TIMETABLE_FRAME_KEY = 'timetable_frame';
const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';
const ALL_LECTURES_KEY = 'allLectures';

type TimetableUserType = 'STUDENT' | 'GENERAL' | '' | null;

type MySemesterQueryParams = {
  userType?: TimetableUserType;
};

type FrameListQueryParams = {
  fallbackOnError?: boolean;
  userType?: TimetableUserType;
};

const canUseStudentTimetableQuery = (token: string, userType?: TimetableUserType) =>
  Boolean(token) && (!userType || userType === 'STUDENT');

export const createDefaultTimetableFrameList = (): TimetableFrameListResponse => [
  {
    id: null,
    name: '기본 시간표',
    is_main: true,
  },
];

export const timetableQueryKeys = {
  mySemester: () => [MY_SEMESTER_INFO_KEY] as const,
  semesterInfo: () => [SEMESTER_INFO_KEY] as const,
  lectureList: (semester: Semester) => [LECTURE_LIST_KEY, semester] as const,
  frameList: (semester: Semester) => [`${TIMETABLE_FRAME_KEY}${semester.year}${semester.term}`] as const,
  lectureInfoAll: [TIMETABLE_INFO_LIST] as const,
  lectureInfo: (timetableFrameId: number) => [TIMETABLE_INFO_LIST, timetableFrameId] as const,
  allLectures: [ALL_LECTURES_KEY] as const,
  version: (type: VersionType) => [type] as const,
};

export const timetableQueries = {
  mySemester: (token: string, { userType }: MySemesterQueryParams = {}) =>
    queryOptions({
      queryKey: timetableQueryKeys.mySemester(),
      queryFn: () => (canUseStudentTimetableQuery(token, userType) ? getMySemester(token) : null),
    }),

  semesterInfo: () =>
    queryOptions({
      queryKey: timetableQueryKeys.semesterInfo(),
      queryFn: getSemesterInfoList,
    }),

  lectureList: (semester: Semester) =>
    queryOptions({
      queryKey: timetableQueryKeys.lectureList(semester),
      queryFn: () => getLectureList(semester),
    }),

  frameList: (token: string, semester: Semester, { fallbackOnError = false, userType }: FrameListQueryParams = {}) =>
    queryOptions({
      queryKey: timetableQueryKeys.frameList(semester),
      queryFn: async () => {
        if (!canUseStudentTimetableQuery(token, userType)) {
          return createDefaultTimetableFrameList();
        }

        if (!fallbackOnError) {
          return getTimetableFrame(token, semester);
        }

        try {
          return await getTimetableFrame(token, semester);
        } catch {
          return createDefaultTimetableFrameList();
        }
      },
    }),

  lectureInfo: (authorization: string, timetableFrameId: number) =>
    queryOptions({
      queryKey: timetableQueryKeys.lectureInfo(timetableFrameId),
      queryFn: () => (authorization ? getTimetableLectureInfo(authorization, timetableFrameId) : null),
    }),

  allLectures: (token: string) =>
    queryOptions({
      queryKey: timetableQueryKeys.allLectures,
      queryFn: () => (token ? getTimetableAllLectureInfo(token) : null),
    }),

  version: (type: VersionType) =>
    queryOptions({
      queryKey: timetableQueryKeys.version(type),
      queryFn: () => getVersion(type),
    }),
};
