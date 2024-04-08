import axios from 'axios';

export const sendClientError = (error: unknown) => {
  const url = window.location.href;

  const serializedError = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error),
  );

  const deserializedError = Object.assign(
    new Error(),
    JSON.parse(serializedError),
  );

  axios.post('https://api-slack.internal.bcsdlab.com/api/error-notice/frontend', {
    url,
    error: deserializedError,
  });
};
