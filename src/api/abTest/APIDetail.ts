import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { ABTestAssignResponse } from './entity';

export class ABTestAssign<R extends ABTestAssignResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/abtest/assign';

  response!: R;

  data: { title: string, };

  headers: Record<string, string | number> = {};

  auth = true;

  constructor(
    title: string,
    public authorization?: string,
    public accessHistoryId?: string | number | null,
  ) {
    this.data = ({ title });

    if (this.accessHistoryId) {
      this.headers.access_history_id = Number(this.accessHistoryId);
    }
  }
}

export class GetMyABTest<R extends string> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/abtest/me';

  response!: R;

  title: string;

  headers: Record<string, string | number> = {};

  auth = true;

  constructor(
    title: string,
    public accessHistoryId: string | number,
    public authorization?: string,
  ) {
    this.title = title;
    this.headers = {
      access_history_id: this.accessHistoryId,
    };
  }
}
