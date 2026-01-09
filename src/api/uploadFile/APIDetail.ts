import axios from 'axios';
import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { FileData, UploadDomain, UploadURLResponse } from './entity';

export class GetPresignedUrl<R extends UploadURLResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  data: FileData;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    domain: UploadDomain,
    fileData: FileData,
  ) {
    this.path = `${domain}/upload/url`;
    this.data = fileData;
  }
}

export class UploadToS3 {
  static async execute(presignedUrl: string, file: Blob): Promise<void> {
    try {
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
        withCredentials: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('서버 응답 오류가 발생했습니다.');
      }
      throw new Error('오류가 발생했습니다.');
    }
  }
}
