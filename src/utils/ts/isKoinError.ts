import { KoinError } from 'interfaces/APIError';

export function isKoinError(error: unknown): error is KoinError {
  try {
    return (error as KoinError).type === 'KOIN_ERROR';
  } catch {
    return false;
  }
}
