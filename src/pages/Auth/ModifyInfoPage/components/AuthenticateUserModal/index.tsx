import { cn, sha256 } from '@bcsdlab/utils';
import { useEffect, useState } from 'react';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as BlindIcon } from 'assets/svg/blind-icon.svg';
import { ReactComponent as ShowIcon } from 'assets/svg/show-icon.svg';
import { ReactComponent as WarningIcon } from 'assets/svg/warning-icon.svg';
import { ReactComponent as WarningMobileIcon } from 'assets/svg/warning-mobile-icon.svg';
import useCheckPassword from 'components/common/Header/hooks/useCheckPassword';
import { useNavigate } from 'react-router-dom';
import { isKoinError } from '@bcsdlab/koin';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useAuthenticationActions } from 'utils/zustand/authentication';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from './AuthenticateUserModal.module.scss';

export interface AuthenticateUserModalProps {
  onClose: () => void
}

export default function AuthenticateUserModal({
  onClose,
}: AuthenticateUserModalProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isBlind, setIsBlind] = useState(true);
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });

  const isMobile = useMediaQuery();
  const { updateAuthentication } = useAuthenticationActions();
  const {
    mutate: checkPassword, isSuccess: isCheckPasswordSuccess, error, errorMessage,
  } = useCheckPassword();

  const handleCheckPassword = async () => {
    if (password === '') {
      return;
    }
    const hashedPassword = await sha256(password);
    checkPassword({ password: hashedPassword });
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheckPassword();
    }
  };

  const changeIsBlind = () => {
    setIsBlind((prev) => !prev);
  };

  useEffect(() => {
    if (isCheckPasswordSuccess) {
      updateAuthentication(isCheckPasswordSuccess);
      onClose();
      navigate('/auth/modifyInfo');
    }
  });

  useEffect(() => {
    const handleUnload = () => {
      updateAuthentication(false);
    };

    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, [updateAuthentication]);

  return (
    <div className={styles.background} aria-hidden ref={backgroundRef}>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>내 정보 수정하기</span>
          <CloseIcon className={styles['container__close-button']} onClick={onClose} />
        </header>
        <div
          className={cn({
            [styles.container__caption]: true,
            [styles['container__caption--error']]: isKoinError(error),
          })}
        >
          보안을 위해 비밀번호 입력이 필요합니다.
        </div>
        <div className={styles.container__footer}>
          <div className={styles.container__input}>
            <input
              type={isBlind ? 'password' : 'text'}
              placeholder="비밀번호를 입력해주세요"
              className={cn({
                [styles['container__password-input']]: true,
                [styles['container__password-input--error']]: isKoinError(error),
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleEnterKeyDown}
            />
            <button type="button" onClick={changeIsBlind} className={styles['container__blind-button']}>
              {isBlind ? <BlindIcon /> : <ShowIcon />}
            </button>
            {isMobile && isKoinError(error) && (
            <span className={styles['container__mobile-error-message']}>
              <WarningMobileIcon />
              {errorMessage}
            </span>
            )}
            <button
              type="button"
              className={cn({
                [styles['container__check-button']]: true,
                [styles['container__check-button--error']]: isKoinError(error),
              })}
              onClick={handleCheckPassword}
            >
              확인하기
            </button>
          </div>
        </div>
        {!isMobile && isKoinError(error) && error
           && (
           <span className={styles['container__error-message']}>
             <WarningIcon />
             {errorMessage}
           </span>
           )}
      </div>
    </div>
  );
}
