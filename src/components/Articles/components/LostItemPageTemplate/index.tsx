import React from 'react';
import AddIcon from 'assets/svg/Articles/add.svg';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './LostItemPageTemplate.module.scss';

interface LostItemPageTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  isFound: boolean;
  children: React.ReactNode;
  bottomButtonText: string;
  onBottomButtonClick: () => void;
  isBottomButtonDisabled?: boolean;
  onAddButtonClick?: () => void;
}

export default function LostItemPageTemplate({
  title,
  subtitle,
  description,
  isFound,
  children,
  bottomButtonText,
  onBottomButtonClick,
  isBottomButtonDisabled = false,
  onAddButtonClick,
}: LostItemPageTemplateProps) {
  const isMobile = useMediaQuery();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.header__title}>
            {isMobile ? subtitle : title}
            {isMobile && <span>{isFound ? <FoundIcon /> : <LostIcon />}</span>}
          </span>
          <div className={styles['header__info-wrapper']}>
            <span className={styles.header__description}>{description}</span>
            <span className={styles.header__info}>
              <span>*</span> 표시는 필수 입력란입니다.
            </span>
          </div>
        </div>
        <div className={styles.forms}>{children}</div>

        <div className={styles.buttons}>
          {onAddButtonClick && (
            <button className={styles['buttons__add']} type="button" onClick={onAddButtonClick}>
              <AddIcon />
              물품 추가
            </button>
          )}
          <div className={styles['buttons__group']}>
            {!isMobile && (
              <button
                className={`${styles['buttons__button']} ${styles['buttons__button--cancel']}`}
                type="button"
                onClick={onBottomButtonClick}
                disabled={isBottomButtonDisabled}
              >
                취소하기
              </button>
            )}
            <button
              className={styles['buttons__button']}
              type="button"
              onClick={onBottomButtonClick}
              disabled={isBottomButtonDisabled}
            >
              {bottomButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
