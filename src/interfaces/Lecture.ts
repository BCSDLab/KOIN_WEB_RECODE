import { Lecture } from 'api/timetable/entity';

export interface TimetableInfoFromLocalStorage {
  [key: string]: Lecture[];
}
