import { useState, useEffect } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { useTokenStore } from 'utils/zustand/auth';
import { STORAGE_KEY, COMPLETION_STATUS } from 'static/auth';

export default function useUserInfoModal() {
  const { token } = useTokenStore();
  const { data: userInfo } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (!token || !isStudentUser(userInfo)) {
      return;
    }

    const persistentState = localStorage.getItem(STORAGE_KEY.USER_INFO_COMPLETION);

    if (persistentState === COMPLETION_STATUS.COMPLETED) {
      return;
    }

    const requiredFields: (keyof typeof userInfo)[] = [
      'login_id',
      'gender',
      'major',
      'name',
      'phone_number',
      'student_number',
    ];

    const isInfoMissing = requiredFields.some(
      (field) => userInfo[field] === undefined || userInfo[field] === null || userInfo[field] === '',
    );

    if (!isInfoMissing) {
      localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.COMPLETED);
      return;
    }

    const hasShownThisSession = sessionStorage.getItem(STORAGE_KEY.MODAL_SESSION_SHOWN) === 'true';
    if (hasShownThisSession) {
      return;
    }

    const isFirstTime = persistentState !== COMPLETION_STATUS.SKIPPED;

    if (isFirstTime) {
      localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.SKIPPED);
    }

    setShowCloseButton(!isFirstTime);
    setIsModalOpen(true);
    sessionStorage.setItem(STORAGE_KEY.MODAL_SESSION_SHOWN, 'true');
  }, [token, userInfo]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSkipModal = () => {
    localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.SKIPPED);
    closeModal();
  };

  return {
    isModalOpen,
    showCloseButton,
    handleSkipModal,
    closeModal,
  };
}
