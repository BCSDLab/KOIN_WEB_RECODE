import { isomorphicSessionStorage } from 'utils/ts/env';

const getElapsedSeconds = (entryTimeKey: string) => (
  (new Date().getTime() - Number(isomorphicSessionStorage.getItem(entryTimeKey))) / 1000
);

export default getElapsedSeconds;
