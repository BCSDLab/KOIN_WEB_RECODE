import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type { FileData, UploadDomain, UploadURLResponse } from './entity';
import type { APIResponse } from 'interfaces/APIResponse';

export class GetPresignedUrl<R extends UploadURLResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  data: FileData;

  response!: R;

  constructor(
    public authorization: string,
    domain: UploadDomain,
    fileData: FileData,
  ) {
    this.path = `${domain}/upload/url`;
    this.data = fileData;
  }
}

export class UploadToS3<R extends APIResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  data: Blob;

  response!: R;

  baseURL = '';

  headers: Record<string, string>;

  convertBody = (data: unknown) => data as unknown as string;

  constructor(presignedUrl: string, file: Blob) {
    this.path = presignedUrl;
    this.data = file;
    this.headers = {
      'Content-Type': file.type,
    };
  }
}
