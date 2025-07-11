import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser, getGeneralUser } from 'api/auth';
import { UserResponse, GeneralUserResponse } from 'api/auth/entity';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import { validateUserInfo } from 'utils/ts/userInfoValidator';

interface UseUserInfoModalReturn {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  userType: 'STUDENT' | 'GENERAL' | null;
  currentUser: UserResponse | GeneralUserResponse | null;
  isLoading: boolean;
}

export default function useUserInfoModal(): UseUserInfoModalReturn {
  const token = useTokenState();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [userType, setUserType] = useState<'STUDENT' | 'GENERAL' | null>(null);

  const {
    data: studentUser,
    isSuccess: isStudentSuccess,
    isError: isStudentError,
    isLoading: isStudentLoading,
  } = useQuery({
    queryKey: ['user', token],
    queryFn: () => getUser(token),
    enabled: !!token,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const {
    data: generalUser,
    isSuccess: isGeneralSuccess,
    isLoading: isGeneralLoading,
  } = useQuery({
    queryKey: ['generalUser', token],
    queryFn: () => getGeneralUser(token),
    enabled: !!token && isStudentError,
    retry: false,
  });

  const isLoading = isStudentLoading || isGeneralLoading;

  useEffect(() => {
    if (!token) {
      setUserType(null);
      return;
    }

    let currentUser: UserResponse | GeneralUserResponse | null = null;
    let currentUserType: 'STUDENT' | 'GENERAL' | null = null;

    if (isStudentSuccess && studentUser) {
      currentUser = studentUser;
      currentUserType = 'STUDENT';
    } else if (isGeneralSuccess && generalUser) {
      currentUser = generalUser;
      currentUserType = 'GENERAL';
    }

    if (currentUser && currentUserType) {
      setUserType(currentUserType);

      const isValid = validateUserInfo(currentUser);
      if (!isValid) {
        openModal();
      }
    }
  }, [token, studentUser, generalUser, isStudentSuccess, isGeneralSuccess, openModal]);

  const currentUser = userType === 'STUDENT' ? studentUser : generalUser;

  return {
    isModalOpen,
    openModal,
    closeModal,
    userType,
    currentUser: currentUser || null,
    isLoading,
  };
}
