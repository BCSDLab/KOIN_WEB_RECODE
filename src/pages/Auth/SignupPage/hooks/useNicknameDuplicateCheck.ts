import { MutateOptions } from '@tanstack/react-query';
import { NicknameDuplicateCheckResponse } from 'api/auth/entity';
import React from 'react';
import showToast from 'utils/ts/showToast';
import useNicknameCheckServer from './useNicknameCheckServer';

const ADMIN_NICKNAME_REGEX = /admin|관리자/;

const INVALID_NICKNAME_REGEX = /^[A-Za-z가-힣\d]+$/;

const useNicknameDuplicateCheck = () => {
  const [nickname, setNickname] = React.useState('');
  const { data, mutate, status } = useNicknameCheckServer();

  const changeTargetNickname = (
    targetNickname: string,
    options?: MutateOptions<NicknameDuplicateCheckResponse, unknown, string, unknown> | undefined,
  ) => {
    if (ADMIN_NICKNAME_REGEX.test(targetNickname)) {
      showToast('warning', '사용할 수 없는 닉네임입니다.');
      return;
    }
    if (!INVALID_NICKNAME_REGEX.test(targetNickname)) {
      showToast('warning', '닉네임은 한글, 영문 및 숫자만 사용할 수 있습니다.');
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
    mutate(targetNickname, options);
  };

  return {
    changeTargetNickname,
    data,
    mutate,
    status,
    currentCheckedNickname: nickname,
  };
};

export default useNicknameDuplicateCheck;
