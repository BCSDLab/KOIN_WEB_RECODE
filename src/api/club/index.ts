import APIClient from 'utils/ts/apiClient';
import {
  ClubCategories,
  ClubDetail,
  ClubList,
  DeleteClubLike,
  DeleteClubQnA,
  GetClubEventDetail,
  GetClubEventList,
  GetClubQnA,
  GetRecruitmentClub,
  HotClub,
  PostClub,
  PostClubQnA,
  PutClub,
  PutClubInroduction,
  PutClubLike,
  PutNewClubManager,
} from './APIDetail';

export const getClubCategories = APIClient.of(ClubCategories);

export const getClubList = APIClient.of(ClubList);

export const getHotClub = APIClient.of(HotClub);

export const postClub = APIClient.of(PostClub);

export const getClubDetail = APIClient.of(ClubDetail);

export const putClubLike = APIClient.of(PutClubLike);

export const deleteClubLike = APIClient.of(DeleteClubLike);

export const putClubInroduction = APIClient.of(PutClubInroduction);

export const postClubQnA = APIClient.of(PostClubQnA);

export const getClubQnA = APIClient.of(GetClubQnA);

export const deleteClubQnA = APIClient.of(DeleteClubQnA);

export const putClubDetail = APIClient.of(PutClub);

export const putNewClubManager = APIClient.of(PutNewClubManager);

export const getRecruitmentClub = APIClient.of(GetRecruitmentClub);

export const getClubEventList = APIClient.of(GetClubEventList);

export const getClubEventDetail = APIClient.of(GetClubEventDetail);
