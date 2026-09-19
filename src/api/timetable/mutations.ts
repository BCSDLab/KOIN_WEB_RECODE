import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import { graduationCalculatorQueryKeys } from 'api/graduationCalculator/queries';

import type {
  AddTimetableFrameRequest,
  AddTimetableLectureCustomRequest,
  AddTimetableLectureRegularRequest,
  RollbackTimetableLectureRequest,
  Semester,
  TimetableCustomLecture,
  TimetableFrameInfo,
  TimetableRegularLecture,
} from './entity';
import {
  addTimetableFrame,
  addTimetableLectureCustom,
  addTimetableLectureRegular,
  deleteSemester,
  deleteTimetableFrame,
  deleteTimetableLecture,
  editTimetableFrame,
  editTimetableLectureCustom,
  editTimetableLectureRegular,
  rollbackTimetableFrame,
  rollbackTimetableLecture,
} from './index';
import { timetableQueryKeys } from './queries';

interface DeleteTimetableFrameVariables {
  id: number;
}

interface EditTimetableLectureRegularVariables {
  timetableFrameId: number;
  editedLecture: TimetableRegularLecture;
  token: string;
}

interface EditTimetableLectureCustomVariables {
  timetableFrameId: number;
  editedLecture: TimetableCustomLecture;
  token: string;
}

const invalidateFrameList = (queryClient: QueryClient, semester: Semester, token: string) =>
  queryClient.invalidateQueries({ queryKey: timetableQueryKeys.frameList(semester, token) });

export const timetableMutations = {
  addSemester: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (data: AddTimetableFrameRequest) => addTimetableFrame(data, token),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.mySemester(token) });
        await invalidateFrameList(queryClient, semester, token);
      },
    }),

  addFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (data: AddTimetableFrameRequest) => addTimetableFrame(data, token),
      onSuccess: () => invalidateFrameList(queryClient, semester, token),
    }),

  updateFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (frameInfo: TimetableFrameInfo) =>
        editTimetableFrame(token, frameInfo.id!, { name: frameInfo.name, is_main: frameInfo.is_main }),
      onSuccess: () => invalidateFrameList(queryClient, semester, token),
    }),

  deleteFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: ({ id }: DeleteTimetableFrameVariables) => deleteTimetableFrame(token, id),
      onSuccess: () => invalidateFrameList(queryClient, semester, token),
    }),

  rollbackFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (timetableFrameId: number) => rollbackTimetableFrame(token, timetableFrameId),
      onSuccess: () => invalidateFrameList(queryClient, semester, token),
    }),

  deleteSemester: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: () => deleteSemester(token, semester),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.mySemester(token) });
        await invalidateFrameList(queryClient, semester, token);
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
      },
    }),

  addLectureRegular: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (data: AddTimetableLectureRegularRequest) => addTimetableLectureRegular(data, token),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetable_frame_id, token), data);
      },
    }),

  addLectureCustom: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (data: AddTimetableLectureCustomRequest) => addTimetableLectureCustom(data, token),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetable_frame_id, token), data);
      },
    }),

  editLectureRegular: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ timetableFrameId, editedLecture, token }: EditTimetableLectureRegularVariables) =>
        editTimetableLectureRegular({ timetable_frame_id: timetableFrameId, timetable_lecture: editedLecture }, token),
      onSuccess: async (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetableFrameId, variables.token), data);
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.allLectures(variables.token) });
      },
    }),

  editLectureCustom: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ timetableFrameId, editedLecture, token }: EditTimetableLectureCustomVariables) =>
        editTimetableLectureCustom({ timetable_frame_id: timetableFrameId, timetable_lecture: editedLecture }, token),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetableFrameId, variables.token), data);
      },
    }),

  deleteLecture: (queryClient: QueryClient, authorization: string) =>
    mutationOptions({
      mutationFn: (id: number) => deleteTimetableLecture(authorization, id),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.lectureInfoAll });
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
      },
    }),

  rollbackLecture: (queryClient: QueryClient, token: string, timetableFrameId: number) =>
    mutationOptions({
      mutationFn: (data: RollbackTimetableLectureRequest) => rollbackTimetableLecture(data, token),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: timetableQueryKeys.lectureInfo(timetableFrameId, token) }),
    }),
};
