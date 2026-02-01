import APIClient from 'utils/ts/apiClient';
import { CourseSearch, PreCourseList } from './APIDetail';

export const getCourseSearch = APIClient.of(CourseSearch);

export const getPreCourseList = APIClient.of(PreCourseList);
