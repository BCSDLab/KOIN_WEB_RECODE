import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { useTokenStore } from 'utils/zustand/auth';
import { storageStore } from 'utils/stores/storageStore';
import { COMPLETION_STATUS } from 'static/auth';

function useClientReady() {
  return useSyncExternalStore(
    (notify) => {
      const timeoutId = setTimeout(notify, 0);
      return () => clearTimeout(timeoutId);
    },
    () => true,
    () => false,
  );
}

export default function useUserInfoModal() {
  const isClientReady = useClientReady();
  const { token } = useTokenStore();
  const { data: userInfo } = useUser();

  const storageSnapshot = useSyncExternalStore(
    storageStore.subscribe,
    storageStore.getSnapshot,
    () => ({ completion: null, sessionShown: false }),
  );

  let isInformationMissing = false;
  if (isStudentUser(userInfo)) {
    const requiredFields: Array<
      'login_id' | 'gender' | 'major' | 'name' | 'phone_number' | 'student_number'
    > = ['login_id', 'gender', 'major', 'name', 'phone_number', 'student_number'];

    for (const field of requiredFields) {
      const value = (userInfo as any)?.[field];
      if (value === undefined || value === null || value === '') {
        isInformationMissing = true;
        break;
      }
    }
  }

  const isModalOpen =
    isClientReady &&
    !!token &&
    isStudentUser(userInfo) &&
    storageSnapshot.completion !== COMPLETION_STATUS.COMPLETED &&
    isInformationMissing &&
    !storageSnapshot.sessionShown;

  const showCloseButton =
    isModalOpen && storageSnapshot.completion === COMPLETION_STATUS.SKIPPED;

  useEffect(() => {
    if (!isClientReady || !token || !isStudentUser(userInfo)) {
      return;
    }
    if (!isInformationMissing && storageSnapshot.completion !== COMPLETION_STATUS.COMPLETED) {
      storageStore.markCompleted();
    }
  }, [isClientReady, token, userInfo, isInformationMissing, storageSnapshot.completion]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }
    if (storageSnapshot.completion !== COMPLETION_STATUS.SKIPPED) {
      storageStore.markSkipped();
    }
    storageStore.setSessionShown();
  }, [isModalOpen, storageSnapshot.completion]);

  function closeModal() {
    storageStore.setSessionShown();
  }

  function handleSkipModal() {
    storageStore.markSkipped();
    storageStore.setSessionShown();
  }

  return {
    isModalOpen,
    showCloseButton,
    handleSkipModal,
    closeModal,
  };
}
