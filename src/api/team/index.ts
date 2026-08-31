import APIClient from 'utils/ts/apiClient';

import {
  DeleteTeamRecruitment,
  DeleteTeamRecruitmentNotifications,
  GetMyCreatedTeamRecruitments,
  GetMyTeamRecruitmentApplications,
  GetTeamRecruitmentApplicantDetail,
  GetTeamRecruitmentDetail,
  GetTeamRecruitmentChatMessages,
  GetTeamRecruitmentChatRoom,
  GetTeamRecruitmentApplicants,
  GetTeamRecruitmentList,
  GetTeamRecruitmentNotifications,
  PostTeamRecruitment,
  PostTeamRecruitmentApplication,
  PostTeamRecruitmentChatMessage,
  PostTeamRecruitmentDirectChatRoom,
  PostTeamRecruitmentNotificationRead,
  PostTeamRecruitmentNotificationsMarkAllRead,
  PutTeamRecruitment,
  PutCloseTeamRecruitment,
  PutTeamRecruitmentApplicationStatus,
} from './APIDetail';

export const deleteTeamRecruitment = APIClient.of(DeleteTeamRecruitment);
export const getTeamRecruitmentDetail = APIClient.of(GetTeamRecruitmentDetail);
export const createTeamRecruitment = APIClient.of(PostTeamRecruitment);
export const updateTeamRecruitment = APIClient.of(PutTeamRecruitment);
export const getTeamRecruitmentList = APIClient.of(GetTeamRecruitmentList);
export const getMyTeamRecruitmentApplications = APIClient.of(GetMyTeamRecruitmentApplications);
export const getTeamRecruitmentApplicants = APIClient.of(GetTeamRecruitmentApplicants);
export const getTeamRecruitmentApplicantDetail = APIClient.of(GetTeamRecruitmentApplicantDetail);
export const submitTeamRecruitmentApplication = APIClient.of(PostTeamRecruitmentApplication);
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
export const updateTeamRecruitmentApplicationStatus = APIClient.of(PutTeamRecruitmentApplicationStatus);
