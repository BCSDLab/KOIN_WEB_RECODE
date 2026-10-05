import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import type { TeamRecruitmentProfileResponse, UpsertTeamRecruitmentProfileRequest } from './entity';

export class TeamRecruitmentProfileDetail<R extends TeamRecruitmentProfileResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/team-recruitment-profiles/me';

  response!: R;

  auth = true;
}

export class UpsertTeamRecruitmentProfile<R extends TeamRecruitmentProfileResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/team-recruitment-profiles/me';

  response!: R;

  data: UpsertTeamRecruitmentProfileRequest;

  auth = true;

  constructor(data: UpsertTeamRecruitmentProfileRequest) {
    this.data = data;
  }
}
