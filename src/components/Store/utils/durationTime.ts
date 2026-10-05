import { isomorphicSessionStorage } from 'utils/ts/env';

const MAIN_ENTRY_TIME = 'main-entry-time';
const CATEGORY_ENTRY_TIME = 'category-entry-time';

const initializeTime = (key: string) => {
  const currentTime = new Date().getTime();
  isomorphicSessionStorage.setItem(key, currentTime.toString());
};

export const initializeMainEntryTime = () => initializeTime(MAIN_ENTRY_TIME);
export const initializeCategoryEntryTime = () => initializeTime(CATEGORY_ENTRY_TIME);

const getTime = (key: string) => {
  const currentTime = new Date().getTime();
  const mainEntryTime = Number(isomorphicSessionStorage.getItem(key)) || currentTime;
  return (currentTime - mainEntryTime) / 1000;
};

export const getMainDurationTime = () => getTime(MAIN_ENTRY_TIME);
export const getCategoryDurationTime = () => getTime(CATEGORY_ENTRY_TIME);
