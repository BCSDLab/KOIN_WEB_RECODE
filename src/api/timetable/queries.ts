import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { Semester, TimetableFrameListResponse, VersionType } from './entity';
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

interface MySemesterQueryParams {
  userType?: TimetableUserType;
}

interface FrameListQueryParams {
  fallbackOnError?: boolean;
  hasUserSemester?: boolean;
  userType?: TimetableUserType;
}

const canUseStudentTimetableQuery = (token: string, userType?: TimetableUserType) =>
  Boolean(token) && (!userType || userType === 'STUDENT');

export const isValidTimetableFrameId = (timetableFrameId: number | null | undefined): timetableFrameId is number =>
  typeof timetableFrameId === 'number' && Number.isInteger(timetableFrameId) && timetableFrameId > 0;

export const createDefaultTimetableFrameList = (): TimetableFrameListResponse => [
  {
    id: null,
    name: '기본 시간표',
    is_main: true,
  },
];

export const timetableQueryKeys = {
  mySemester: (token?: string | null) => [MY_SEMESTER_INFO_KEY, getViewerScope(token)] as const,
  semesterInfo: () => [SEMESTER_INFO_KEY] as const,
  lectureList: (semester: Semester) => [LECTURE_LIST_KEY, semester] as const,
  frameList: (semester: Semester, token?: string | null) =>
    [`${TIMETABLE_FRAME_KEY}${semester.year}${semester.term}`, getViewerScope(token)] as const,
  lectureInfoAll: [TIMETABLE_INFO_LIST] as const,
  lectureInfo: (timetableFrameId: number, token?: string | null) =>
    [TIMETABLE_INFO_LIST, timetableFrameId, getViewerScope(token)] as const,
  allLectures: (token?: string | null) => [ALL_LECTURES_KEY, getViewerScope(token)] as const,
  version: (type: VersionType) => [type] as const,
};

export const timetableQueries = {
  mySemester: (token: string, { userType }: MySemesterQueryParams = {}) =>
    // userType은 조회 대상 리소스(내 시간표)를 바꾸지 않고 조회 가능 여부만 결정하므로 키에서 제외한다.
    // SSR에서는 서버 쿠키로, 클라이언트에서는 zustand 스토어로 읽어 값을 얻는 시점이 달라 키에 넣으면
    // getServerSideProps의 프리페치 키와 클라이언트 첫 렌더의 키가 어긋난다.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryOptions({
      queryKey: timetableQueryKeys.mySemester(token),
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

  frameList: (
    token: string,
    semester: Semester,
    { fallbackOnError = false, hasUserSemester = true, userType }: FrameListQueryParams = {},
  ) =>
    // hasUserSemester/fallbackOnError/userType은 호출부의 에러 처리·조회 가능 여부일 뿐 조회 대상 리소스를
    // 바꾸지 않는다. userType은 mySemester와 같은 이유(SSR/클라이언트 값 취득 시점 차이)로도 키에서 제외한다.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryOptions({
      queryKey: timetableQueryKeys.frameList(semester, token),
      queryFn: async () => {
        if (!hasUserSemester || !canUseStudentTimetableQuery(token, userType)) {
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
      queryKey: timetableQueryKeys.lectureInfo(timetableFrameId, authorization),
      queryFn: () =>
        authorization && isValidTimetableFrameId(timetableFrameId)
          ? getTimetableLectureInfo(authorization, timetableFrameId)
          : null,
    }),

  allLectures: (token: string) =>
    queryOptions({
      queryKey: timetableQueryKeys.allLectures(token),
      queryFn: () => (token ? getTimetableAllLectureInfo(token) : null),
    }),

  version: (type: VersionType) =>
    queryOptions({
      queryKey: timetableQueryKeys.version(type),
      queryFn: () => getVersion(type),
    }),
};
