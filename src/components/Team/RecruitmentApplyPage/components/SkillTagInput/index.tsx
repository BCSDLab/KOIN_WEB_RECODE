import XIcon from 'assets/svg/Team/x-icon.svg';
import { APPLY_SKILL_MAX_LENGTH } from 'components/Team/RecruitmentApplyPage/schema';
import type { ApplicationFormValues } from 'components/Team/RecruitmentApplyPage/types';
import { useFieldArray, useFormContext } from 'react-hook-form';

import styles from './SkillTagInput.module.scss';

interface SkillTagInputProps {
  label: string;
  description: string;
  addButtonLabel: string;
  placeholder: string;
  error?: string;
  onAppend?: () => void;
}

export default function SkillTagInput({
  label,
  description,
  addButtonLabel,
  placeholder,
  error,
  onAppend,
}: SkillTagInputProps) {
  const { control, register } = useFormContext<ApplicationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  const handleAppend = () => {
    append({ value: '' });
    onAppend?.();
  };

  return (
    <div className={styles['tag-input']}>
      <div className={styles['tag-input__head']}>
        <span className={styles['tag-input__label']}>{label}</span>
        <p className={styles['tag-input__description']}>{description}</p>
      </div>

      {fields.length > 0 && (
        <ul className={styles['tag-input__list']}>
          {fields.map((field, index) => (
            <li key={field.id} className={styles['tag-input__tag']}>
              <input
                type="text"
                className={styles['tag-input__field']}
                placeholder={placeholder}
                maxLength={APPLY_SKILL_MAX_LENGTH}
                {...register(`skills.${index}.value` as const)}
              />
              <button
                type="button"
                className={styles['tag-input__remove']}
                onClick={() => remove(index)}
                aria-label={`${label} ${index + 1} 삭제`}
              >
                <XIcon aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles['tag-input__add']} onClick={handleAppend}>
        {addButtonLabel}
      </button>

      {error && <p className={styles['tag-input__error']}>{error}</p>}
    </div>
  );
}
