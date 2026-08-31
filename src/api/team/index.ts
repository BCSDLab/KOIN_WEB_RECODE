import APIClient from 'utils/ts/apiClient';

import {
  DeleteTeamRecruitmentNotifications,
  GetMyCreatedTeamRecruitments,
  GetMyTeamRecruitmentApplications,
  GetTeamRecruitmentApplicantDetail,
  GetTeamRecruitmentApplicants,
  GetTeamRecruitmentList,
  GetTeamRecruitmentNotifications,
  PostTeamRecruitmentNotificationRead,
  PostTeamRecruitmentNotificationsMarkAllRead,
  PutCloseTeamRecruitment,
  PutTeamRecruitmentApplicationStatus,
} from './APIDetail';

export const getTeamRecruitmentList = APIClient.of(GetTeamRecruitmentList);
export const getMyTeamRecruitmentApplications = APIClient.of(GetMyTeamRecruitmentApplications);
export const getTeamRecruitmentApplicants = APIClient.of(GetTeamRecruitmentApplicants);
export const getTeamRecruitmentApplicantDetail = APIClient.of(GetTeamRecruitmentApplicantDetail);
export const getTeamRecruitmentNotifications = APIClient.of(GetTeamRecruitmentNotifications);
export const markTeamRecruitmentNotificationRead = APIClient.of(PostTeamRecruitmentNotificationRead);
export const markAllTeamRecruitmentNotificationsRead = APIClient.of(PostTeamRecruitmentNotificationsMarkAllRead);
export const deleteAllTeamRecruitmentNotifications = APIClient.of(DeleteTeamRecruitmentNotifications);
export const getMyCreatedTeamRecruitments = APIClient.of(GetMyCreatedTeamRecruitments);
export const closeTeamRecruitment = APIClient.of(PutCloseTeamRecruitment);
export const updateTeamRecruitmentApplicationStatus = APIClient.of(PutTeamRecruitmentApplicationStatus);
