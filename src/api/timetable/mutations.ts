import { mutationOptions, QueryClient } from '@tanstack/react-query';
import { graduationCalculatorQueryKeys } from 'api/graduationCalculator/queries';
import {
  AddTimetableFrameRequest,
  AddTimetableLectureCustomRequest,
  AddTimetableLectureRegularRequest,
  RollbackTimetableLectureRequest,
  Semester,
  TimetableCustomLecture,
  TimetableFrameInfo,
  TimetableRegularLecture,
} from './entity';
import { timetableQueryKeys } from './queries';
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

type DeleteTimetableFrameVariables = {
  id: number;
};

type EditTimetableLectureRegularVariables = {
  timetableFrameId: number;
  editedLecture: TimetableRegularLecture;
  token: string;
};

type EditTimetableLectureCustomVariables = {
  timetableFrameId: number;
  editedLecture: TimetableCustomLecture;
  token: string;
};

const invalidateFrameList = (queryClient: QueryClient, semester: Semester) =>
  queryClient.invalidateQueries({ queryKey: timetableQueryKeys.frameList(semester) });

export const timetableMutations = {
  addSemester: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (data: AddTimetableFrameRequest) => addTimetableFrame(data, token),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.mySemester() });
        await invalidateFrameList(queryClient, semester);
      },
    }),

  addFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (data: AddTimetableFrameRequest) => addTimetableFrame(data, token),
      onSuccess: () => invalidateFrameList(queryClient, semester),
    }),

  updateFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (frameInfo: TimetableFrameInfo) =>
        editTimetableFrame(token, frameInfo.id!, { name: frameInfo.name, is_main: frameInfo.is_main }),
      onSuccess: () => invalidateFrameList(queryClient, semester),
    }),

  deleteFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: ({ id }: DeleteTimetableFrameVariables) => deleteTimetableFrame(token, id),
      onSuccess: () => invalidateFrameList(queryClient, semester),
    }),

  rollbackFrame: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: (timetableFrameId: number) => rollbackTimetableFrame(token, timetableFrameId),
      onSuccess: () => invalidateFrameList(queryClient, semester),
    }),

  deleteSemester: (queryClient: QueryClient, token: string, semester: Semester) =>
    mutationOptions({
      mutationFn: () => deleteSemester(token, semester),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.mySemester() });
        await invalidateFrameList(queryClient, semester);
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
      },
    }),

  addLectureRegular: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (data: AddTimetableLectureRegularRequest) => addTimetableLectureRegular(data, token),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetable_frame_id), data);
      },
    }),

  addLectureCustom: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (data: AddTimetableLectureCustomRequest) => addTimetableLectureCustom(data, token),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetable_frame_id), data);
      },
    }),

  editLectureRegular: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ timetableFrameId, editedLecture, token }: EditTimetableLectureRegularVariables) =>
        editTimetableLectureRegular(
          { timetable_frame_id: timetableFrameId, timetable_lecture: editedLecture },
          token,
        ),
      onSuccess: async (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetableFrameId), data);
        await queryClient.invalidateQueries({ queryKey: graduationCalculatorQueryKeys.all });
        await queryClient.invalidateQueries({ queryKey: timetableQueryKeys.allLectures });
      },
    }),

  editLectureCustom: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ timetableFrameId, editedLecture, token }: EditTimetableLectureCustomVariables) =>
        editTimetableLectureCustom({ timetable_frame_id: timetableFrameId, timetable_lecture: editedLecture }, token),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(timetableQueryKeys.lectureInfo(variables.timetableFrameId), data);
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
      onSuccess: () => queryClient.invalidateQueries({ queryKey: timetableQueryKeys.lectureInfo(timetableFrameId) }),
    }),
};
