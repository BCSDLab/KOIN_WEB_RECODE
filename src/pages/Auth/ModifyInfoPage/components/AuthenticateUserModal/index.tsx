import { cn, sha256 } from '@bcsdlab/utils';
import { useEffect, useState } from 'react';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import BlindIcon from 'assets/svg/blind-icon.svg';
import ShowIcon from 'assets/svg/show-icon.svg';
import WarningIcon from 'assets/svg/warning-icon.svg';
import WarningMobileIcon from 'assets/svg/warning-mobile-icon.svg';
import useCheckPassword from 'components/layout/Header/hooks/useCheckPassword';
import { useNavigate } from 'react-router-dom';
import { isKoinError } from '@bcsdlab/koin';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useAuthenticationActions } from 'utils/zustand/authentication';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './AuthenticateUserModal.module.scss';

export interface AuthenticateUserModalProps {
  onClose: () => void;
  disabledClose?: boolean;
}

export default function AuthenticateUserModal({
  onClose,
  disabledClose = false,
}: AuthenticateUserModalProps) {
  const logger = useLogger();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isBlind, setIsBlind] = useState(true);
  const handleClose = disabledClose ? () => navigate(ROUTES.Main()) : onClose;
  const { backgroundRef } = useOutsideClick({ onOutsideClick: handleClose });
  useEscapeKeyDown({ onEscape: handleClose });

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
    logger.actionEventClick({
      team: 'USER',
      event_label: 'header',
      value: '정보수정 시도',
    });
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
      navigate(ROUTES.AuthModifyInfo());
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
          <div
            className={styles['container__close-button']}
            onClick={handleClose}
            role="button"
            aria-hidden
          >
            <CloseIcon />
          </div>
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
                [styles['container__check-button--input']]: password !== '' && !isKoinError(error),
                [styles['container__check-button--input-open']]: password !== '' && !isBlind && !isKoinError(error),
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
