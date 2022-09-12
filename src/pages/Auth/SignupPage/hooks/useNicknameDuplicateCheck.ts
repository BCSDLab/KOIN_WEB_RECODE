import { auth } from 'api';
import { APIError } from 'interfaces/APIError';
import React from 'react';
import { useQuery } from 'react-query';
import showToast from 'utils/ts/showToast';

const NICKNAME_REGEX = /admin|관리자/;

const useNicknameDuplicateCheck = () => {
  const [nickname, setNickname] = React.useState('');
  const changeTargetNickname = (targetNickname: string) => {
    if (NICKNAME_REGEX.test(targetNickname)) {
      showToast('warning', '사용할 수 없는 닉네임입니다.');
      return;
    }
    if (!targetNickname) {
      showToast('warning', '닉네임을 입력해주세요.');
      return;
    }
    if (targetNickname.length > 10) {
      showToast('warning', '닉네임은 10자리 이하여야 합니다.');
      return;
    }
    setNickname(targetNickname);
  };
  const { data, error, status } = useQuery(
    ['nickname-duplicate-check', nickname],
    ({ queryKey }) => auth.nicknameDuplicateCheck(queryKey[1]),
    {
      enabled: !!nickname,
      onError: (responseError: APIError) => {
        if (responseError.status === 409) {
          showToast('error', '사용 불가능한 닉네임입니다.');
          return;
        }
        if (responseError.status === 409) {
          showToast('error', '올바르지 않은 닉네임 형식입니다.');
          return;
        }
        showToast('error', '네트워크 연결을 확인해주세요.');
      },
    },
  );

  return {
    changeTargetNickname,
    data,
    error,
    status,
    currentCheckedNickname: nickname,
  };
};

export default useNicknameDuplicateCheck;
