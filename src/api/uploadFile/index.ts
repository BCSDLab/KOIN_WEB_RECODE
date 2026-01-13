import APIClient from 'utils/ts/apiClient';
import { GetPresignedUrl, UploadToS3 } from './APIDetail';

export const getPresignedUrl = APIClient.of(GetPresignedUrl);

export const uploadToS3 = APIClient.of(UploadToS3);
