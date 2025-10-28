import { useEffect, useMemo, useState } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { useTokenStore } from 'utils/zustand/auth';
import { STORAGE_KEY, COMPLETION_STATUS } from 'static/auth';

export default function useUserInfoModal() {
  const { token } = useTokenStore();
  const { data: userInfo } = useUser();

  const [dismissed, setDismissed] = useState(false);

  const isStudent = isStudentUser(userInfo);
  const requiredFields = useMemo(
    () => (isStudent ? ['login_id', 'gender', 'major', 'name', 'phone_number', 'student_number'] : []) as (keyof NonNullable<typeof userInfo>)[],
    [isStudent],
  );

  const isInfoMissing = useMemo(() => {
    if (!token || !isStudent || !userInfo) return false;
    return requiredFields.some(
      (field) =>
        userInfo[field] === undefined ||
        userInfo[field] === null ||
        userInfo[field] === '',
    );
  }, [token, isStudent, userInfo, requiredFields]);

  const persistentState = useMemo<string | null>(
    () => (typeof window === 'undefined' ? null : localStorage.getItem(STORAGE_KEY.USER_INFO_COMPLETION)),
    [],
  );

  const hasShownThisSession = useMemo<boolean>(
    () => (typeof window !== 'undefined'
      ? sessionStorage.getItem(STORAGE_KEY.MODAL_SESSION_SHOWN) === 'true'
      : false),
    [],
  );

  const isFirstTime = persistentState !== COMPLETION_STATUS.SKIPPED;

  const shouldOpen = !!(token && isStudent && isInfoMissing && !hasShownThisSession);

  const isModalOpen = shouldOpen && !dismissed;
  const showCloseButton = !isFirstTime;

  useEffect(() => {
    if (!token || !isStudent) return;
    if (!isInfoMissing) {
      localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.COMPLETED);
    }
  }, [token, isStudent, isInfoMissing]);

  useEffect(() => {
    if (!isModalOpen) return;
    sessionStorage.setItem(STORAGE_KEY.MODAL_SESSION_SHOWN, 'true');
    if (isFirstTime) {
      localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.SKIPPED);
    }
  }, [isModalOpen, isFirstTime]);

  const closeModal = () => setDismissed(true);

  const handleSkipModal = () => {
    localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.SKIPPED);
    setDismissed(true);
  };

  return {
    isModalOpen,
    showCloseButton,
    handleSkipModal,
    closeModal,
  };
}
