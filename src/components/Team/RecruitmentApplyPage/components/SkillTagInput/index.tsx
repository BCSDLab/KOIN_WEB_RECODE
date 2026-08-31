import XIcon from 'assets/svg/Team/x-icon.svg';
import { APPLY_SKILL_MAX_LENGTH } from 'components/Team/RecruitmentApplyPage/schema';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from 'components/Team/RecruitmentApplyPage/types';
import styles from './SkillTagInput.module.scss';

interface SkillTagInputProps {
  label: string;
  description: string;
  addButtonLabel: string;
  placeholder: string;
  onAppend?: () => void;
}

export default function SkillTagInput({
  label,
  description,
  addButtonLabel,
  placeholder,
  onAppend,
}: SkillTagInputProps) {
  const { control, register } = useFormContext<ApplicationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  const handleAppend = () => {
    append({ value: '' });
    onAppend?.();
  };

  return (
    <div className={styles.tagInput}>
      <div className={styles.tagInput__head}>
        <span className={styles.tagInput__label}>{label}</span>
        <p className={styles.tagInput__description}>{description}</p>
      </div>

      {fields.length > 0 && (
        <ul className={styles.tagInput__list}>
          {fields.map((field, index) => (
            <li key={field.id} className={styles.tagInput__tag}>
              <input
                type="text"
                className={styles.tagInput__field}
                placeholder={placeholder}
                maxLength={APPLY_SKILL_MAX_LENGTH}
                {...register(`skills.${index}.value` as const)}
              />
              <button
                type="button"
                className={styles.tagInput__remove}
                onClick={() => remove(index)}
                aria-label={`${label} ${index + 1} 삭제`}
              >
                <XIcon aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.tagInput__add} onClick={handleAppend}>
        {addButtonLabel}
      </button>
    </div>
  );
}
