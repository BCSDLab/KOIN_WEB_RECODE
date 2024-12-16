import APIClient from 'utils/ts/apiClient';
import {
  BusInfo, BusNoticeInfo, BusTimetableInfo, CityBusTimetableInfo, CourseList,
  ShuttleCourseInfo, ShuttleTimetableDetailInfo,
} from './APIDetail';

export const getCourseList = APIClient.of(CourseList);

export const getBusInfo = APIClient.of(BusInfo);

export const getBusTimetableInfo = APIClient.of(BusTimetableInfo);

export const getCityBusTimetableInfo = APIClient.of(CityBusTimetableInfo);

export const getShuttleCourseInfo = APIClient.of(ShuttleCourseInfo);

export const getShuttleTimetableDetailInfo = APIClient.of(ShuttleTimetableDetailInfo);

export const getBusNoticeInfo = APIClient.of(BusNoticeInfo);
