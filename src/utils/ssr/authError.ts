import { isKoinError } from '@bcsdlab/koin';

export function isServerAuthError(error: unknown): boolean {
  return isKoinError(error) && error.status === 401;
}
