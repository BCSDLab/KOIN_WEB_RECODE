import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { TeamRecruitmentProfileResponse, UpsertTeamRecruitmentProfileRequest } from './entity';

export class TeamRecruitmentProfileDetail<R extends TeamRecruitmentProfileResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/team-recruitment-profiles/me';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class UpsertTeamRecruitmentProfile<R extends TeamRecruitmentProfileResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/team-recruitment-profiles/me';

  response!: R;

  data: UpsertTeamRecruitmentProfileRequest;

  auth = true;

  constructor(
    public authorization: string,
    data: UpsertTeamRecruitmentProfileRequest,
  ) {
    this.data = data;
  }
}
