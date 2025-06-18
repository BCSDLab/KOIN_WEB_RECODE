import { useSuspenseQuery } from '@tanstack/react-query';
import { getGeneralUser, getUser } from 'api/auth';
import { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { saveTokensToNative } from 'utils/ts/iosBridge';
import { UserType, useTokenStore } from 'utils/zustand/auth';

export type UnionUserResponse = UserResponse | GeneralUserResponse;

const getUserInfo = async (token: string, userType: UserType): Promise<UnionUserResponse> => {
  try {
    if (userType === 'STUDENT') {
      return await getUser(token);
    }
    return await getGeneralUser(token);
  } catch (error: any) {
    // 웹뷰 환경에서 401 에러 처리
    if (typeof window !== 'undefined' && window.webkit?.messageHandlers != null) {
      if (error?.status === 401 || error?.response?.status === 401) {
        // Zustand 스토어 토큰 초기화
        useTokenStore.getState().setToken('');
        useTokenStore.getState().setRefreshToken('');

        // 네이티브 토큰도 초기화
        await saveTokensToNative('', '');

        // 강제 새로고침 필요하면 다시 추가
        // window.location.reload();
      }
    }

    // 에러를 다시 throw (기존 동작 유지)
    throw error;
  }
};

export const useUser = () => {
  const { token, userType } = useTokenStore();
  const { data, isError } = useSuspenseQuery({
    queryKey: ['userInfo', token, userType],
    queryFn: () => {
      if (!token) return null;
      return getUserInfo(token, userType);
    },
  });

  return {
    data: isError ? null : data,
  };
};
