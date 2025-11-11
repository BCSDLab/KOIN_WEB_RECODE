import { useEffect, useMemo } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { useTokenStore } from 'utils/zustand/auth';
import { STORAGE_KEY, COMPLETION_STATUS } from 'static/auth';
import { useLocalStorage, useSessionStorage } from 'utils/hooks/state/useWebStorage';

type Completion = (typeof COMPLETION_STATUS)[keyof typeof COMPLETION_STATUS];

export default function useUserInfoModal() {
  const { token } = useTokenStore();
  const { data: userInfo } = useUser();

  const [completion, setCompletion] = useLocalStorage<Completion | null>(
    STORAGE_KEY.USER_INFO_COMPLETION,
    null,
  );

  const [sessionShown, setSessionShown] = useSessionStorage<boolean>(
    STORAGE_KEY.MODAL_SESSION_SHOWN,
    false,
  );

  const isStudent = isStudentUser(userInfo);

  const isInfoMissing = useMemo(() => {
    if (!isStudent) return false;
    const requiredFields: (keyof typeof userInfo)[] = [
      'login_id',
      'gender',
      'major',
      'name',
      'phone_number',
      'student_number',
    ];
    return requiredFields.some((field) => {
      const v = userInfo?.[field] as unknown;
      return v === undefined || v === null || v === '';
    });
  }, [isStudent, userInfo]);

  const canOpen =
    !!token &&
    isStudent &&
    completion !== COMPLETION_STATUS.COMPLETED &&
    isInfoMissing &&
    !sessionShown;

  const isFirstTime = completion !== COMPLETION_STATUS.SKIPPED;
  const isModalOpen = canOpen;
  const showCloseButton = canOpen ? !isFirstTime : false;

  useEffect(() => {
    if (!token || !isStudent) return;
    if (!isInfoMissing && completion !== COMPLETION_STATUS.COMPLETED) {
      setCompletion(COMPLETION_STATUS.COMPLETED);
    }
  }, [token, isStudent, isInfoMissing, completion, setCompletion]);

  const closeModal = () => {
    setSessionShown(true);
  };

  const handleSkipModal = () => {
    if (completion !== COMPLETION_STATUS.SKIPPED) {
      setCompletion(COMPLETION_STATUS.SKIPPED);
    }
    setSessionShown(true);
  };

  return {
    isModalOpen,
    showCloseButton,
    handleSkipModal,
    closeModal,
  };
}
