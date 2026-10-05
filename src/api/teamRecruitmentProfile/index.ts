import APIClient from 'utils/ts/apiClient';
import { TeamRecruitmentProfileDetail, UpsertTeamRecruitmentProfile } from './APIDetail';

export const getTeamRecruitmentProfile = APIClient.of(TeamRecruitmentProfileDetail);
export const upsertTeamRecruitmentProfile = APIClient.of(UpsertTeamRecruitmentProfile);
