import APIClient from 'utils/ts/apiClient';

import {
  DeleteTeamRecruitment,
  DeleteTeamRecruitmentNotifications,
  GetMyCreatedTeamRecruitments,
  GetMyTeamRecruitmentApplications,
  GetTeamRecruitmentDetail,
  GetTeamRecruitmentApplicants,
  GetTeamRecruitmentList,
  GetTeamRecruitmentNotifications,
  PostTeamRecruitmentNotificationRead,
  PostTeamRecruitmentNotificationsMarkAllRead,
  PutTeamRecruitment,
  PutCloseTeamRecruitment,
} from './APIDetail';

export const deleteTeamRecruitment = APIClient.of(DeleteTeamRecruitment);
export const getTeamRecruitmentDetail = APIClient.of(GetTeamRecruitmentDetail);
export const updateTeamRecruitment = APIClient.of(PutTeamRecruitment);
export const getTeamRecruitmentList = APIClient.of(GetTeamRecruitmentList);
export const getMyTeamRecruitmentApplications = APIClient.of(GetMyTeamRecruitmentApplications);
export const getTeamRecruitmentApplicants = APIClient.of(GetTeamRecruitmentApplicants);
export const getTeamRecruitmentNotifications = APIClient.of(GetTeamRecruitmentNotifications);
export const markTeamRecruitmentNotificationRead = APIClient.of(PostTeamRecruitmentNotificationRead);
export const markAllTeamRecruitmentNotificationsRead = APIClient.of(PostTeamRecruitmentNotificationsMarkAllRead);
export const deleteAllTeamRecruitmentNotifications = APIClient.of(DeleteTeamRecruitmentNotifications);
export const getMyCreatedTeamRecruitments = APIClient.of(GetMyCreatedTeamRecruitments);
export const closeTeamRecruitment = APIClient.of(PutCloseTeamRecruitment);
