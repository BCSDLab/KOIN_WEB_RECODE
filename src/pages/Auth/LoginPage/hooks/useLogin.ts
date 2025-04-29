import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { sha256 } from '@bcsdlab/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from 'api';
import { LoginResponse } from 'api/auth/entity';
import { useLoginRedirect } from 'utils/hooks/auth/useLoginRedirect';
import { setCookie } from 'utils/ts/cookie';
import showToast from 'utils/ts/showToast';
import { useTokenStore } from 'utils/zustand/auth';

interface IsAutoLogin {
  isAutoLoginFlag: boolean;
}

interface UserInfo {
  userId: string;
  password: string;
}

const emailLocalPartRegex = /^[a-z_0-9]{1,12}$/;

export const useLogin = (state: IsAutoLogin) => {
  const { setToken, setRefreshToken } = useTokenStore();
  const { redirectAfterLogin } = useLoginRedirect();
  const queryClient = useQueryClient();

  const postLogin = useMutation({
    mutationFn: auth.login,
    onSuccess: (data: LoginResponse) => {
      if (state.isAutoLoginFlag) {
        setRefreshToken(data.refresh_token);
      }

      queryClient.invalidateQueries();
      setCookie('AUTH_TOKEN_KEY', data.token);
      setToken(data.token);
      redirectAfterLogin();
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '로그인에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '로그인에 실패했습니다.');
      }
    },
  });

  const login = async (userInfo: UserInfo) => {
    if (userInfo.userId === '') {
      showToast('error', '계정을 입력해주세요');
      return;
    }
    if (userInfo.password === '') {
      showToast('error', '비밀번호를 입력해주세요');
      return;
    }
    if (userInfo.userId.indexOf('@koreatech.ac.kr') !== -1) {
      showToast('error', '계정명은 @koreatech.ac.kr을 빼고 입력해주세요.');
      return;
    }
    if (!emailLocalPartRegex.test(userInfo.userId)) {
      showToast('error', '아우누리 계정 형식이 아닙니다.');
      return;
    }
    const hashedPassword = await sha256(userInfo.password);

    postLogin.mutate({
      email: `${userInfo.userId}@koreatech.ac.kr`,
      password: hashedPassword,
    });
  };
  return login;
};
