import { useEffect, useState } from 'react';
import SpinIcon from 'assets/svg/Callvan/spin.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import StatusBadge from 'components/Callvan/components/StatusBadge';
import BottomModal, { BottomModalContent, BottomModalFooter, BottomModalHeader } from 'components/ui/BottomModal';
import type {
  TeamRecruitmentCategory,
  TeamRecruitmentMeetingType,
  TeamRecruitmentSort,
  TeamRecruitmentStatusFilter,
} from 'api/team/entity';
import styles from './RecruitmentFilterPanel.module.scss';

const STATUS_OPTIONS: { value: TeamRecruitmentStatusFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'RECRUITING', label: '모집 중' },
  { value: 'CLOSED', label: '모집 완료' },
];

const SORT_OPTIONS: { value: TeamRecruitmentSort; label: string }[] = [
  { value: 'LATEST_DESC', label: '최신순' },
  { value: 'DEADLINE_ASC', label: '마감 임박순' },
];

const CATEGORY_OPTIONS: { value: TeamRecruitmentCategory; label: string }[] = [
  { value: 'CONTEST', label: '공모전' },
  { value: 'EXTERNAL_ACTIVITY', label: '대외활동' },
  { value: 'STUDY', label: '스터디' },
  { value: 'PROJECT', label: '프로젝트' },
  { value: 'OTHER', label: '기타' },
];

const MEETING_TYPE_OPTIONS: { value: TeamRecruitmentMeetingType; label: string }[] = [
  { value: 'ONLINE', label: '온라인' },
  { value: 'OFFLINE', label: '오프라인' },
  { value: 'MIXED', label: '온·오프라인' },
];

export interface TeamRecruitmentFilter {
  status: TeamRecruitmentStatusFilter;
  categories: TeamRecruitmentCategory[];
  meetingType?: TeamRecruitmentMeetingType;
  sort: TeamRecruitmentSort;
}

export const DEFAULT_TEAM_RECRUITMENT_FILTER: TeamRecruitmentFilter = {
  status: 'ALL',
  categories: [],
  meetingType: undefined,
  sort: 'LATEST_DESC',
};

interface RecruitmentFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filter: TeamRecruitmentFilter;
  onApply: (filter: TeamRecruitmentFilter) => void;
}

const copyFilter = (filter: TeamRecruitmentFilter): TeamRecruitmentFilter => ({
  ...filter,
  categories: [...filter.categories],
});

export default function RecruitmentFilterPanel({
  isOpen,
  onClose,
  filter,
  onApply,
}: RecruitmentFilterPanelProps) {
  return (
    <BottomModal isOpen={isOpen} onClose={onClose} className={styles.panel} aria-label="모집글 필터">
      <RecruitmentFilterPanelContent filter={filter} onClose={onClose} onApply={onApply} />
    </BottomModal>
  );
}

function RecruitmentFilterPanelContent({
  onClose,
  filter,
  onApply,
}: Omit<RecruitmentFilterPanelProps, 'isOpen'>) {
  const [draftFilter, setDraftFilter] = useState<TeamRecruitmentFilter>(() => copyFilter(filter));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleToggleCategory = (category: TeamRecruitmentCategory) => {
    setDraftFilter((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category];

      return {
        ...prev,
        categories: categories.length === CATEGORY_OPTIONS.length ? [] : categories,
      };
    });
  };

  const handleReset = () => {
    setDraftFilter(copyFilter(DEFAULT_TEAM_RECRUITMENT_FILTER));
  };

  const handleApply = () => {
    onApply(copyFilter(draftFilter));
    onClose();
  };

  return (
    <>
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
            {STATUS_OPTIONS.map((option) => (
              <StatusBadge
                key={option.value}
                label={option.label}
                isActive={draftFilter.status === option.value}
                onClick={() => setDraftFilter((prev) => ({ ...prev, status: option.value }))}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>정렬</h3>
          <div className={styles.sectionBadges}>
            {SORT_OPTIONS.map((option) => (
              <StatusBadge
                key={option.value}
                label={option.label}
                isActive={draftFilter.sort === option.value}
                onClick={() => setDraftFilter((prev) => ({ ...prev, sort: option.value }))}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>카테고리</h3>
          <div className={styles.sectionBadges}>
            <StatusBadge
              label="전체"
              isActive={draftFilter.categories.length === 0}
              onClick={() => setDraftFilter((prev) => ({ ...prev, categories: [] }))}
            />
            {CATEGORY_OPTIONS.map((option) => (
              <StatusBadge
                key={option.value}
                label={option.label}
                isActive={draftFilter.categories.includes(option.value)}
                onClick={() => handleToggleCategory(option.value)}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>진행 방식</h3>
          <div className={styles.sectionBadges}>
            <StatusBadge
              label="전체"
              isActive={draftFilter.meetingType === undefined}
              onClick={() => setDraftFilter((prev) => ({ ...prev, meetingType: undefined }))}
            />
            {MEETING_TYPE_OPTIONS.map((option) => (
              <StatusBadge
                key={option.value}
                label={option.label}
                isActive={draftFilter.meetingType === option.value}
                onClick={() => setDraftFilter((prev) => ({ ...prev, meetingType: option.value }))}
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
    </>
  );
}
