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

const canUseStudentTimetableQuery = (isLoggedIn: boolean, userType?: TimetableUserType) =>
  isLoggedIn && (!userType || userType === 'STUDENT');

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
  mySemester: (isLoggedIn: boolean) => [MY_SEMESTER_INFO_KEY, getViewerScope(isLoggedIn)] as const,
  semesterInfo: () => [SEMESTER_INFO_KEY] as const,
  lectureList: (semester: Semester) => [LECTURE_LIST_KEY, semester] as const,
  frameList: (semester: Semester, isLoggedIn: boolean) =>
    [`${TIMETABLE_FRAME_KEY}${semester.year}${semester.term}`, getViewerScope(isLoggedIn)] as const,
  lectureInfoAll: [TIMETABLE_INFO_LIST] as const,
  lectureInfo: (timetableFrameId: number, isLoggedIn: boolean) =>
    [TIMETABLE_INFO_LIST, timetableFrameId, getViewerScope(isLoggedIn)] as const,
  allLectures: (isLoggedIn: boolean) => [ALL_LECTURES_KEY, getViewerScope(isLoggedIn)] as const,
  version: (type: VersionType) => [type] as const,
};

export const timetableQueries = {
  mySemester: (isLoggedIn: boolean, { userType }: MySemesterQueryParams = {}) =>
    // userType은 조회 대상 리소스(내 시간표)를 바꾸지 않고 조회 가능 여부만 결정하므로 키에서 제외한다.
    // SSR에서는 서버 쿠키로, 클라이언트에서는 zustand 스토어로 읽어 값을 얻는 시점이 달라 키에 넣으면
    // getServerSideProps의 프리페치 키와 클라이언트 첫 렌더의 키가 어긋난다.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- userType은 SSR/클라이언트 취득 시점이 달라 키에서 제외
    queryOptions({
      queryKey: timetableQueryKeys.mySemester(isLoggedIn),
      queryFn: () => (canUseStudentTimetableQuery(isLoggedIn, userType) ? getMySemester() : null),
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
    isLoggedIn: boolean,
    semester: Semester,
    { fallbackOnError = false, hasUserSemester = true, userType }: FrameListQueryParams = {},
  ) =>
    // hasUserSemester/fallbackOnError/userType은 호출부의 에러 처리·조회 가능 여부일 뿐 조회 대상 리소스를
    // 바꾸지 않는다. userType은 mySemester와 같은 이유(SSR/클라이언트 값 취득 시점 차이)로도 키에서 제외한다.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- hasUserSemester/fallbackOnError/userType은 조회 대상을 바꾸지 않는다
    queryOptions({
      queryKey: timetableQueryKeys.frameList(semester, isLoggedIn),
      queryFn: async () => {
        if (!hasUserSemester || !canUseStudentTimetableQuery(isLoggedIn, userType)) {
          return createDefaultTimetableFrameList();
        }

        if (!fallbackOnError) {
          return getTimetableFrame(semester);
        }

        try {
          return await getTimetableFrame(semester);
        } catch {
          return createDefaultTimetableFrameList();
        }
      },
    }),

  lectureInfo: (isLoggedIn: boolean, timetableFrameId: number) =>
    queryOptions({
      queryKey: timetableQueryKeys.lectureInfo(timetableFrameId, isLoggedIn),
      queryFn: () =>
        isLoggedIn && isValidTimetableFrameId(timetableFrameId) ? getTimetableLectureInfo(timetableFrameId) : null,
    }),

  allLectures: (isLoggedIn: boolean) =>
    queryOptions({
      queryKey: timetableQueryKeys.allLectures(isLoggedIn),
      queryFn: () => (isLoggedIn ? getTimetableAllLectureInfo() : null),
    }),

  version: (type: VersionType) =>
    queryOptions({
      queryKey: timetableQueryKeys.version(type),
      queryFn: () => getVersion(type),
    }),
};
