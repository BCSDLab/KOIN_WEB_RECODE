import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { sha256 } from '@bcsdlab/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from 'api';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLoginRedirect } from 'utils/hooks/auth/useLoginRedirect';
import { CookieOptions, setCookie } from 'utils/ts/cookie';
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

const debugCookieLog = (message: string, data: any) => {
  // 1) window 글로벌 공간에도 기록 (console.log 제거돼도 남음)
  (window as any).__COOKIE_DEBUG__ = (window as any).__COOKIE_DEBUG__ || [];
  (window as any).__COOKIE_DEBUG__.push({ message, data, time: new Date().toISOString() });

  // 2) DOM에 주석노드로도 기록 → DevTools의 Elements에서 확인 가능
  try {
    const comment = document.createComment(`[COOKIE_DEBUG] ${message}: ${JSON.stringify(data)}`);
    document.body.appendChild(comment);
  } catch {}
};

const getCookieDomain = () => {
  if (typeof window === 'undefined') return undefined;

  const hostname = window.location.hostname;

  // 콘솔 대신 안전한 로그 기록
  debugCookieLog('Current hostname', hostname);

  if (hostname === 'localhost') {
    debugCookieLog('Cookie domain decision', 'localhost → undefined');
    return undefined;
  }

  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const domain = `.${parts.slice(-2).join('.')}`; // .koreatech.in
    debugCookieLog('Setting cookie domain to', domain);
    return domain;
  }

  debugCookieLog('Cookie domain decision', 'parts < 2 → undefined');
  return undefined;
};

export const useLogin = (state: IsAutoLogin) => {
  const { setToken, setRefreshToken, setUserType } = useTokenStore();
  const { redirectAfterLogin } = useLoginRedirect();
  const queryClient = useQueryClient();
  const logger = useLogger();

  const postLogin = useMutation({
    mutationFn: auth.login,
    onSuccess: (data: LoginResponse) => {
      const domain = getCookieDomain();
      const isSecure = window.location.protocol === 'https:';

      logger.actionEventClick({
        team: 'USER',
        event_label: 'login',
        value: '로그인 완료',
      });
      if (state.isAutoLoginFlag) {
        setRefreshToken(data.refresh_token);
      }
      queryClient.invalidateQueries();

      const cookieOptions: CookieOptions = {
        domain: domain,
        path: '/',
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax', // https에서만 none 사용
      };
      setCookie('AUTH_TOKEN_KEY', data.token, cookieOptions);
      setCookie('AUTH_USER_TYPE', data.user_type, cookieOptions);
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
