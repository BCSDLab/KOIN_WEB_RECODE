import { TEAM_RECRUITMENT_CATEGORY_OPTIONS } from 'components/Team/NewTeamRecruitment/constants';
import { Selector } from 'components/ui/Selector';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CategoryField.module.scss';

interface CategoryFieldProps {
  eventLabel: string;
  value: string | null;
  onChange: (value: string) => void;
}

export default function CategoryField({ eventLabel, value, onChange }: CategoryFieldProps) {
  const logger = useLogger();

  return (
    <div className={styles.field}>
      <div className={styles.field__label}>
        카테고리 <span className={styles['field__label-required']}>*</span>
      </div>
      <div className={styles.field__dropdown}>
        <Selector
          isWhiteBackground={false}
          options={TEAM_RECRUITMENT_CATEGORY_OPTIONS}
          value={value}
          onChange={(e) => {
            logger.actionEventClick({
              team: 'CAMPUS',
              event_label: eventLabel,
              value: e.target.value,
            });
            onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
