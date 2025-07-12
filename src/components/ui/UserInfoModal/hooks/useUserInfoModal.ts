import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser, getGeneralUser } from 'api/auth';
import { UserResponse, GeneralUserResponse } from 'api/auth/entity';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useTokenStore } from 'utils/zustand/auth';
import { validateUserInfo } from 'utils/ts/userInfoValidator';

type UserInfoModalState = 'FIRST_TIME' | 'SKIPPED_ONCE' | 'COMPLETED';

interface UseUserInfoModalReturn {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  userType: 'STUDENT' | 'GENERAL' | null;
  currentUser: UserResponse | GeneralUserResponse | null;
  isLoading: boolean;
  showCloseButton: boolean;
  handleSkipModal: () => void;
  handleCompleteInfo: () => void;
}

interface SessionInfo {
  currentToken: string;
  hasShownModal: boolean;
}

export default function useUserInfoModal(): UseUserInfoModalReturn {
  const token = useTokenState();
  const { userType: storedUserType } = useTokenStore();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [userType, setUserType] = useState<'STUDENT' | 'GENERAL' | null>(null);
  const [modalState, setModalState] = useState<UserInfoModalState>(() => {
    try {
      const saved = localStorage.getItem('userInfoModalState') as UserInfoModalState;
      return ['FIRST_TIME', 'SKIPPED_ONCE', 'COMPLETED'].includes(saved) ? saved : 'FIRST_TIME';
    } catch {
      return 'FIRST_TIME';
    }
  });

  const SESSION_KEY = 'userInfoModal_session';

  const getSessionInfo = useCallback((): SessionInfo | null => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const hasShownModalThisSession = useCallback((): boolean => {
    if (!token) return false;

    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return false;

    return sessionInfo.currentToken === token && sessionInfo.hasShownModal;
  }, [token, getSessionInfo]);

  const markModalAsShownThisSession = useCallback(() => {
    if (!token) return;

    const sessionInfo: SessionInfo = {
      currentToken: token,
      hasShownModal: true,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionInfo));
  }, [token]);

  const showCloseButton = modalState === 'SKIPPED_ONCE';

  const handleSkipModal = () => {
    localStorage.setItem('userInfoModalState', 'SKIPPED_ONCE');
    setModalState('SKIPPED_ONCE');
    markModalAsShownThisSession();
    closeModal();
  };

  const handleCompleteInfo = () => {
    if (modalState === 'FIRST_TIME') {
      localStorage.setItem('userInfoModalState', 'SKIPPED_ONCE');
      setModalState('SKIPPED_ONCE');
    }

    markModalAsShownThisSession();
    closeModal();
  };

  const shouldCallStudentAPI = !storedUserType || storedUserType === 'STUDENT';
  const shouldCallGeneralAPI = storedUserType === 'GENERAL';

  const {
    data: studentUser,
    isSuccess: isStudentSuccess,
    isError: isStudentError,
    isLoading: isStudentLoading,
  } = useQuery({
    queryKey: ['user', token],
    queryFn: () => getUser(token),
    enabled: !!token && shouldCallStudentAPI,
    retry: false,
  });

  const {
    data: generalUser,
    isSuccess: isGeneralSuccess,
    isLoading: isGeneralLoading,
  } = useQuery({
    queryKey: ['generalUser', token],
    queryFn: () => getGeneralUser(token),
    enabled: !!token && (shouldCallGeneralAPI || isStudentError),
    retry: false,
  });

  const isLoading = isStudentLoading || isGeneralLoading;

  useEffect(() => {
    if (token && storedUserType && !userType) {
      setUserType(storedUserType);
    }
  }, [token, storedUserType, userType]);

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

      if (isValid) {
        localStorage.setItem('userInfoModalState', 'COMPLETED');
        setModalState('COMPLETED');
        return;
      }

      if (!isValid && !hasShownModalThisSession()) {
        openModal();
        markModalAsShownThisSession();
      }
    }
  }, [
    token,
    studentUser,
    generalUser,
    isStudentSuccess,
    isGeneralSuccess,
    isStudentError,
    openModal,
    modalState,
    hasShownModalThisSession,
    markModalAsShownThisSession,
  ]);

  const currentUser = userType === 'STUDENT' ? studentUser : generalUser;

  return {
    isModalOpen,
    openModal,
    closeModal,
    userType,
    currentUser: currentUser || null,
    isLoading,
    showCloseButton,
    handleSkipModal,
    handleCompleteInfo,
  };
}
