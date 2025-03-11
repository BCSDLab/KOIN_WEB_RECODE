const MAIN_ENTRY_TIME = 'main-entry-time';
const CATEGORY_ENTRY_TIME = 'category-entry-time';

export const initializeMainEntryTime = () => {
  const currentTime = new Date().getTime();
  sessionStorage.setItem(MAIN_ENTRY_TIME, currentTime.toString());
};

export const initializeCategoryEntryTime = () => {
  const currentTime = new Date().getTime();
  sessionStorage.setItem(CATEGORY_ENTRY_TIME, currentTime.toString());
};

export const getMainDurationTime = () => {
  const currentTime = new Date().getTime();
  const mainEntryTime = Number(sessionStorage.getItem(MAIN_ENTRY_TIME)) || currentTime;
  return (currentTime - mainEntryTime) / 1000;
};

export const getCategoryDurationTime = () => {
  const currentTime = new Date().getTime();
  const categoryEntryTime = Number(sessionStorage.getItem(CATEGORY_ENTRY_TIME)) || currentTime;
  return (currentTime - categoryEntryTime) / 1000;
};
