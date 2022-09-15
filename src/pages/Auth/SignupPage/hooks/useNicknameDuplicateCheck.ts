import React from 'react';
import showToast from 'utils/ts/showToast';
import useNicknameCheckServer from './useNicknameCheckServer';

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
  const { data, error, status } = useNicknameCheckServer(nickname);

  return {
    changeTargetNickname,
    data,
    error,
    status,
    currentCheckedNickname: nickname,
  };
};

export default useNicknameDuplicateCheck;
