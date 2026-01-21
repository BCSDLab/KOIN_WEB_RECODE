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
          <span className={styles.header__description}>{description}</span>
        </div>
        <div className={styles.forms}>{children}</div>
        {onAddButtonClick && (
          <div className={styles.add}>
            <button className={styles.add__button} type="button" onClick={onAddButtonClick}>
              <AddIcon />
              물품 추가
            </button>
          </div>
        )}
        <div className={styles.complete}>
          <button
            className={styles.complete__button}
            type="button"
            onClick={onBottomButtonClick}
            disabled={isBottomButtonDisabled}
          >
            {bottomButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
