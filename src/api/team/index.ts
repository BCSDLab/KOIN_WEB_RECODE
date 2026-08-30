import APIClient from 'utils/ts/apiClient';

import {
  DeleteTeamRecruitmentNotifications,
  GetMyCreatedTeamRecruitments,
  GetMyTeamRecruitmentApplications,
  GetTeamRecruitmentChatMessages,
  GetTeamRecruitmentChatRoom,
  GetTeamRecruitmentApplicants,
  GetTeamRecruitmentList,
  GetTeamRecruitmentNotifications,
  PostTeamRecruitmentChatMessage,
  PostTeamRecruitmentDirectChatRoom,
  PostTeamRecruitmentNotificationRead,
  PostTeamRecruitmentNotificationsMarkAllRead,
  PutCloseTeamRecruitment,
} from './APIDetail';

export const getTeamRecruitmentList = APIClient.of(GetTeamRecruitmentList);
export const getMyTeamRecruitmentApplications = APIClient.of(GetMyTeamRecruitmentApplications);
export const getTeamRecruitmentApplicants = APIClient.of(GetTeamRecruitmentApplicants);
export const getTeamRecruitmentNotifications = APIClient.of(GetTeamRecruitmentNotifications);
export const markTeamRecruitmentNotificationRead = APIClient.of(PostTeamRecruitmentNotificationRead);
export const markAllTeamRecruitmentNotificationsRead = APIClient.of(PostTeamRecruitmentNotificationsMarkAllRead);
export const deleteAllTeamRecruitmentNotifications = APIClient.of(DeleteTeamRecruitmentNotifications);
export const getTeamRecruitmentChatRoom = APIClient.of(GetTeamRecruitmentChatRoom);
export const getTeamRecruitmentChatMessages = APIClient.of(GetTeamRecruitmentChatMessages);
export const sendTeamRecruitmentChatMessage = APIClient.of(PostTeamRecruitmentChatMessage);
export const createTeamRecruitmentDirectChatRoom = APIClient.of(PostTeamRecruitmentDirectChatRoom);
export const getMyCreatedTeamRecruitments = APIClient.of(GetMyCreatedTeamRecruitments);
export const closeTeamRecruitment = APIClient.of(PutCloseTeamRecruitment);
