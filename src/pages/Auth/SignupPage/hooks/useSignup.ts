import { auth } from 'api';
// import React from 'react';
import { useMutation } from 'react-query';

const useSignup = () => {
  const { status, mutate } = useMutation(auth.signup);

  return {
    status,
    mutate,
  };
};

export default useSignup;
