import APIClient from 'utils/ts/apiClient';
import {
  ClubCategories,
  ClubList,
  HotClub,
  PostClub,
} from './APIDetail';

export const getClubCategories = APIClient.of(ClubCategories);

export const getClubList = APIClient.of(ClubList);

export const getHotClub = APIClient.of(HotClub);

export const postClub = APIClient.of(PostClub);
