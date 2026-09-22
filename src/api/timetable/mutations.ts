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
  isLoggedIn: boolean;
}

interface EditTimetableLectureCustomVariables {
  timetableFrameId: number;
  editedLecture: TimetableCustomLecture;
  isLoggedIn: boolean;
}

const invalidateFrameList = (queryClient: QueryClient, semester: Semester, isLoggedIn: boolean) =>
  queryClient.invalidateQueries({ queryKey: timetableQueryKeys.frameList(semester, isLoggedIn) });

export const timetableMutations = {
  addSemester: (queryClient: QueryClient, isLoggedIn: boolean, semester: Semester) =>
    mutationOptions({
      mutationFn: (data: AddTimetableFrameRequest) => addTimetableFrame(data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.mySemester(isLoggedIn) });
        await invalidateFrameList(queryClient, semester, isLoggedIn);
      },
    }),

  addFrame: (queryClient: QueryClient, isLoggedIn: boolean, semester: Semester) =>
    mutationOptions({
      mutationFn: (data: AddTimetableFrameRequest) => addTimetableFrame(data),
      onSuccess: () => invalidateFrameList(queryClient, semester, isLoggedIn),
    }),

  updateFrame: (queryClient: QueryClient, isLoggedIn: boolean, semester: Semester) =>
    mutationOptions({
      mutationFn: (frameInfo: TimetableFrameInfo) =>
        editTimetableFrame(frameInfo.id!, { name: frameInfo.name, is_main: frameInfo.is_main }),
      onSuccess: () => invalidateFrameList(queryClient, semester, isLoggedIn),
    }),

  deleteFrame: (queryClient: QueryClient, isLoggedIn: boolean, semester: Semester) =>
    mutationOptions({
      mutationFn: ({ id }: DeleteTimetableFrameVariables) => deleteTimetableFrame(id),
      onSuccess: () => invalidateFrameList(queryClient, semester, isLoggedIn),
    }),

  rollbackFrame: (queryClient: QueryClient, isLoggedIn: boolean, semester: Semester) =>
    mutationOptions({
      mutationFn: (timetableFrameId: number) => rollbackTimetableFrame(timetableFrameId),
      onSuccess: () => invalidateFrameList(queryClient, semester, isLoggedIn),
    }),

  deleteSemester: (queryClient: QueryClient, isLoggedIn: boolean, semester: Semester) =>
    mutationOptions({
      mutationFn: () => deleteSemester(semester),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.mySemester(isLoggedIn) });
        await invalidateFrameList(queryClient, semester, isLoggedIn);
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
      },
    }),

  addLectureRegular: (queryClient: QueryClient, isLoggedIn: boolean) =>
    mutationOptions({
      mutationFn: (data: AddTimetableLectureRegularRequest) => addTimetableLectureRegular(data),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetable_frame_id, isLoggedIn), data);
      },
    }),

  addLectureCustom: (queryClient: QueryClient, isLoggedIn: boolean) =>
    mutationOptions({
      mutationFn: (data: AddTimetableLectureCustomRequest) => addTimetableLectureCustom(data),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetable_frame_id, isLoggedIn), data);
      },
    }),

  editLectureRegular: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ timetableFrameId, editedLecture }: EditTimetableLectureRegularVariables) =>
        editTimetableLectureRegular({ timetable_frame_id: timetableFrameId, timetable_lecture: editedLecture }),
      onSuccess: async (data, variables) => {
        queryClient.setQueryData(
          timetableQueryKeys.lectureInfo(variables.timetableFrameId, variables.isLoggedIn),
          data,
        );
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.allLectures(variables.isLoggedIn) });
      },
    }),

  editLectureCustom: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ timetableFrameId, editedLecture }: EditTimetableLectureCustomVariables) =>
        editTimetableLectureCustom({ timetable_frame_id: timetableFrameId, timetable_lecture: editedLecture }),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(
          timetableQueryKeys.lectureInfo(variables.timetableFrameId, variables.isLoggedIn),
          data,
        );
      },
    }),

  deleteLecture: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (id: number) => deleteTimetableLecture(id),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.lectureInfoAll });
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
      },
    }),

  rollbackLecture: (queryClient: QueryClient, isLoggedIn: boolean, timetableFrameId: number) =>
    mutationOptions({
      mutationFn: (data: RollbackTimetableLectureRequest) => rollbackTimetableLecture(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: timetableQueryKeys.lectureInfo(timetableFrameId, isLoggedIn) }),
    }),
};
