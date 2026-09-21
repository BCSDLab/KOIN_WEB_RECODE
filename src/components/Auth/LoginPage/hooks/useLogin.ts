import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { sha256 } from '@bcsdlab/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { webLogin } from 'api/auth';
import type { WebAuthResponse } from 'api/auth/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLoginRedirect } from 'utils/hooks/auth/useLoginRedirect';
import showToast from 'utils/ts/showToast';
import { useTokenStore } from 'utils/zustand/auth';

interface IsAutoLogin {
  isAutoLoginFlag: boolean;
}

interface UserInfo {
  login_id: string;
  login_pw: string;
}

export const useLogin = (state: IsAutoLogin) => {
  const { setUserType } = useTokenStore();
  const { redirectAfterLogin } = useLoginRedirect();
  const queryClient = useQueryClient();
  const logger = useLogger();

  const postLogin = useMutation({
    mutationFn: webLogin,
    onSuccess: (data: WebAuthResponse) => {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'login',
        value: '로그인 완료',
      });
      // invalidate는 데이터를 남긴 채 stale 표시만 하므로, 리페치가 끝나기 전까지
      // 이전 사용자의 시간표·쪽지 같은 캐시가 그대로 렌더된다. 로그인은 client-side
      // 이동이라(useLoginRedirect의 router.replace) 캐시가 살아남는다. 아예 비운다.
      queryClient.clear();
      // access·refresh는 서버가 HttpOnly 쿠키로 발급한다 — 프론트는 회원 유형만 반영하면 된다.
      setUserType(data.user_type);
      redirectAfterLogin();
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

  const submitLogin = async (userInfo: UserInfo) => {
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
      auto_login: state.isAutoLoginFlag,
    });
  };

  return submitLogin;
};
