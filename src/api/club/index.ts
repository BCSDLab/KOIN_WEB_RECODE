import APIClient from 'utils/ts/apiClient';
import {
  ClubCategories,
  ClubDetail,
  ClubList,
  DeleteClubEvent,
  DeleteClubLike,
  DeleteClubQnA,
  DeleteClubRecruitment,
  DeleteClubRecruitmentNotification,
  GetClubEventDetail,
  GetClubEventList,
  GetClubQnA,
  GetRecruitmentClub,
  GetRelatedSearchClub,
  HotClub,
  PostClub,
  PostClubEvent,
  PostClubQnA,
  PostClubRecruitment,
  PostClubRecruitmentNotification,
  PutClub,
  PutClubEvent,
  PutClubInroduction,
  PutClubLike,
  PutClubRecruitment,
  PutNewClubManager,
} from './APIDetail';

export const getClubCategories = APIClient.of(ClubCategories);

export const getClubList = APIClient.of(ClubList);

export const searchClub = APIClient.of(GetRelatedSearchClub);

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

export const postClubRecruitment = APIClient.of(PostClubRecruitment);

export const putClubRecruitment = APIClient.of(PutClubRecruitment);

export const deleteClubRecruitment = APIClient.of(DeleteClubRecruitment);

export const postClubEvent = APIClient.of(PostClubEvent);

export const putClubEvent = APIClient.of(PutClubEvent);

export const deleteClubEvent = APIClient.of(DeleteClubEvent);

export const postClubRecruitmentNotification = APIClient.of(PostClubRecruitmentNotification);

export const deleteClubRecruitmentNotification = APIClient.of(DeleteClubRecruitmentNotification);
