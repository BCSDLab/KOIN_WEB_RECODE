import APIClient from 'utils/ts/apiClient';

import {
  DeleteTeamRecruitment,
  DeleteTeamRecruitmentNotifications,
  GetMyTeamRecruitmentApplications,
  GetTeamRecruitmentDetail,
  GetTeamRecruitmentList,
  GetTeamRecruitmentNotifications,
  PostTeamRecruitmentNotificationRead,
  PostTeamRecruitmentNotificationsMarkAllRead,
} from './APIDetail';

export const deleteTeamRecruitment = APIClient.of(DeleteTeamRecruitment);
export const getTeamRecruitmentDetail = APIClient.of(GetTeamRecruitmentDetail);
export const getTeamRecruitmentList = APIClient.of(GetTeamRecruitmentList);
export const getMyTeamRecruitmentApplications = APIClient.of(GetMyTeamRecruitmentApplications);
export const getTeamRecruitmentNotifications = APIClient.of(GetTeamRecruitmentNotifications);
export const markTeamRecruitmentNotificationRead = APIClient.of(PostTeamRecruitmentNotificationRead);
export const markAllTeamRecruitmentNotificationsRead = APIClient.of(PostTeamRecruitmentNotificationsMarkAllRead);
export const deleteAllTeamRecruitmentNotifications = APIClient.of(DeleteTeamRecruitmentNotifications);
