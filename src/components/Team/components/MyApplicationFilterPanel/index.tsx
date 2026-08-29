import { useEffect, useState } from 'react';

import SpinIcon from 'assets/svg/Callvan/spin.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import StatusBadge from 'components/Callvan/components/StatusBadge';
import BottomModal, { BottomModalContent, BottomModalFooter, BottomModalHeader } from 'components/ui/BottomModal';
import useLogger from 'utils/hooks/analytics/useLogger';
import type { TeamApplicationStatus, TeamRecruitmentSort } from 'api/team/entity';
import styles from './MyApplicationFilterPanel.module.scss';

const STATUS_OPTIONS: { value: TeamApplicationStatus; label: string }[] = [
  { value: 'ACCEPTED', label: '승인' },
  { value: 'PENDING', label: '대기' },
  { value: 'REJECTED', label: '거절' },
];

const SORT_OPTIONS: { value: TeamRecruitmentSort; label: string }[] = [
  { value: 'LATEST_DESC', label: '최신순' },
  { value: 'DEADLINE_ASC', label: '마감 임박순' },
];

interface MyApplicationFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  statuses: TeamApplicationStatus[];
  sort: TeamRecruitmentSort;
  onApply: (filter: { statuses: TeamApplicationStatus[]; sort: TeamRecruitmentSort }) => void;
}

export default function MyApplicationFilterPanel({
  isOpen,
  onClose,
  statuses,
  sort,
  onApply,
}: MyApplicationFilterPanelProps) {
  const logger = useLogger();

  const [localStatuses, setLocalStatuses] = useState<TeamApplicationStatus[]>(statuses);
  const [localSort, setLocalSort] = useState<TeamRecruitmentSort>(sort);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const logStatusSelect = (value: string) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_applied_post_filter_status', value });
  };

  const handleSelectAllStatuses = () => {
    setLocalStatuses([]);
    logStatusSelect('전체');
  };

  const toggleStatus = (option: { value: TeamApplicationStatus; label: string }) => {
    setLocalStatuses((prev) => {
      if (prev.includes(option.value)) return prev.filter((status) => status !== option.value);
      const next = [...prev, option.value];
      return next.length === STATUS_OPTIONS.length ? [] : next;
    });
    logStatusSelect(option.label);
  };

  const handleSelectSort = (option: { value: TeamRecruitmentSort; label: string }) => {
    setLocalSort(option.value);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_applied_post_filter_sort',
      value: option.label,
    });
  };

  const handleApply = () => {
    onApply({ statuses: localStatuses, sort: localSort });
    onClose();
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_applied_post_filter_apply',
      value: '적용하기',
    });
  };

  const handleReset = () => {
    setLocalStatuses([]);
    setLocalSort('LATEST_DESC');
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_applied_post_filter_reset',
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
          <h3 className={styles.sectionTitle}>지원 상태</h3>
          <div className={styles.sectionBadges}>
            <StatusBadge label="전체" isActive={localStatuses.length === 0} onClick={handleSelectAllStatuses} />
            {STATUS_OPTIONS.map((opt) => (
              <StatusBadge
                key={opt.value}
                label={opt.label}
                isActive={localStatuses.includes(opt.value)}
                onClick={() => toggleStatus(opt)}
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
