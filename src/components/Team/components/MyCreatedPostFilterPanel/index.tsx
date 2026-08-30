import { useEffect, useState } from 'react';
import SpinIcon from 'assets/svg/Callvan/spin.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import StatusBadge from 'components/Callvan/components/StatusBadge';
import BottomModal, { BottomModalContent, BottomModalFooter, BottomModalHeader } from 'components/ui/BottomModal';
import useLogger from 'utils/hooks/analytics/useLogger';
import type { TeamRecruitmentSort, TeamRecruitmentStatusFilter } from 'api/team/entity';
import styles from './MyCreatedPostFilterPanel.module.scss';

const STATUS_OPTIONS: { value: TeamRecruitmentStatusFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'RECRUITING', label: '모집 중' },
  { value: 'CLOSED', label: '모집 마감' },
];

const SORT_OPTIONS: { value: TeamRecruitmentSort; label: string }[] = [
  { value: 'LATEST_DESC', label: '최신순' },
  { value: 'DEADLINE_ASC', label: '마감 임박순' },
];

interface MyCreatedPostFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  status: TeamRecruitmentStatusFilter;
  sort: TeamRecruitmentSort;
  onApply: (filter: { status: TeamRecruitmentStatusFilter; sort: TeamRecruitmentSort }) => void;
}

export default function MyCreatedPostFilterPanel({
  isOpen,
  onClose,
  status,
  sort,
  onApply,
}: MyCreatedPostFilterPanelProps) {
  const logger = useLogger();

  const [localStatus, setLocalStatus] = useState<TeamRecruitmentStatusFilter>(status);
  const [localSort, setLocalSort] = useState<TeamRecruitmentSort>(sort);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelectStatus = (option: { value: TeamRecruitmentStatusFilter; label: string }) => {
    setLocalStatus(option.value);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_filter_status',
      value: option.label,
    });
  };

  const handleSelectSort = (option: { value: TeamRecruitmentSort; label: string }) => {
    setLocalSort(option.value);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_filter_sort',
      value: option.label,
    });
  };

  const handleApply = () => {
    onApply({ status: localStatus, sort: localSort });
    onClose();
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_filter_apply',
      value: '적용하기',
    });
  };

  const handleReset = () => {
    setLocalStatus('ALL');
    setLocalSort('LATEST_DESC');
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_filter_reset',
      value: '초기화',
    });
  };

  return (
    <BottomModal isOpen={isOpen} onClose={onClose} className={styles.panel} aria-label="필터">
      <BottomModalHeader className={styles.header}>
        <span className={styles.headerTitle}>필터</span>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="필터 닫기">
          <CloseIcon />
        </button>
      </BottomModalHeader>

      <BottomModalContent className={styles.content}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>모집 상태</h3>
          <div className={styles.sectionBadges}>
            {STATUS_OPTIONS.map((opt) => (
              <StatusBadge
                key={opt.value}
                label={opt.label}
                isActive={localStatus === opt.value}
                onClick={() => handleSelectStatus(opt)}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>정렬</h3>
          <div className={styles.sectionBadges}>
            {SORT_OPTIONS.map((opt) => (
              <StatusBadge
                key={opt.value}
                label={opt.label}
                isActive={localSort === opt.value}
                onClick={() => handleSelectSort(opt)}
              />
            ))}
          </div>
        </section>
      </BottomModalContent>

      <BottomModalFooter className={styles.footer}>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          초기화
          <SpinIcon />
        </button>
        <button type="button" className={styles.applyButton} onClick={handleApply}>
          적용하기
        </button>
      </BottomModalFooter>
    </BottomModal>
  );
}
