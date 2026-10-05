export type InputMessage = {
  type: 'error' | 'warning' | 'success' | 'info' | 'default';
  content: string;
  code?: 'SMS_LIMIT' | 'ALREADY_REGISTERED' | (string & {});
} | null;
