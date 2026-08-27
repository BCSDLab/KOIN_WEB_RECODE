import APIClient from 'utils/ts/apiClient';

import { GetTeamRecruitmentList, GetTeamRecruitmentNotifications } from './APIDetail';

export const getTeamRecruitmentList = APIClient.of(GetTeamRecruitmentList);
export const getTeamRecruitmentNotifications = APIClient.of(GetTeamRecruitmentNotifications);
