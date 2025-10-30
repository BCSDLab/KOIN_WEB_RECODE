import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { sha256 } from '@bcsdlab/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from 'api';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLoginRedirect } from 'utils/hooks/auth/useLoginRedirect';
import { setCookie } from 'utils/ts/cookie';
import { saveTokensToNative } from 'utils/ts/iosBridge';
import showToast from 'utils/ts/showToast';
import { useTokenStore } from 'utils/zustand/auth';
import type { LoginResponse } from 'api/auth/entity';

interface IsAutoLogin {
  isAutoLoginFlag: boolean;
}

interface UserInfo {
  login_id: string;
  login_pw: string;
}

export const useLogin = (state: IsAutoLogin) => {
  const { setToken, setRefreshToken, setUserType } = useTokenStore();
  const { redirectAfterLogin } = useLoginRedirect();
  const queryClient = useQueryClient();
  const logger = useLogger();

  const postLogin = useMutation({
    mutationFn: auth.login,
    onSuccess: (data: LoginResponse) => {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'login',
        value: '로그인 완료',
      });
      if (state.isAutoLoginFlag) {
        setRefreshToken(data.refresh_token);
      }
      queryClient.invalidateQueries();
      setCookie('AUTH_TOKEN_KEY', data.token);
      setCookie('AUTH_USER_TYPE', data.user_type);
      setToken(data.token);
      setUserType(data.user_type);
      redirectAfterLogin();
      if (window.webkit?.messageHandlers?.tokenBridge) {
        saveTokensToNative(data.token, data.refresh_token);
      }
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '로그인에 실패했습니다.');
        logger.actionEventClick({
          team: 'USER',
          event_label: 'login',
          value: '로그인 실패',
        });
      } else {
        sendClientError(error);
        showToast('error', '로그인에 실패했습니다.');
      }
    },
  });

  const login = async (userInfo: UserInfo) => {
    const hashedPassword = await sha256(userInfo.login_pw);

    if (userInfo.login_id === '') {
      showToast('error', '계정을 입력해주세요');
      return;
    }
    if (userInfo.login_pw === '') {
      showToast('error', '비밀번호를 입력해주세요');
      return;
    }

    postLogin.mutate({
      login_id: userInfo.login_id,
      login_pw: hashedPassword,
    });
  };

  return login;
};
