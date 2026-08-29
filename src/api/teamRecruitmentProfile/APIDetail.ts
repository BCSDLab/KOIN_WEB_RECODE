import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { CreateTeamRecruitmentProfileRequest, CreateTeamRecruitmentProfileResponse } from './entity';

export class CreateTeamRecruitmentProfile<R extends CreateTeamRecruitmentProfileResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  // TODO: 진입점 페이지의 `/team-recruitment-profiles/me` 목업 주석에서 유추한 가정치. API 명세 확정 후 검증 필요
  path = '/team-recruitment-profiles';

  response!: R;

  data: CreateTeamRecruitmentProfileRequest;

  auth = true;

  constructor(
    public authorization: string,
    data: CreateTeamRecruitmentProfileRequest,
  ) {
    this.data = data;
  }
}
