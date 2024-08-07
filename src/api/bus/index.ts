import APIClient from 'utils/ts/apiClient';
import {
  BusInfo, BusTimetableInfo, CityBusTimetableInfo, CourseList,
} from './APIDetail';

export const getCourseList = APIClient.of(CourseList);

export const getBusInfo = APIClient.of(BusInfo);

export const getBusTimetableInfo = APIClient.of(BusTimetableInfo);

export const getCityBusTimetableInfo = APIClient.of(CityBusTimetableInfo);
