import { useRef } from 'react';
import PencilLineIcon from 'assets/svg/Team/pencil-line-icon.svg';
import XIcon from 'assets/svg/Team/x-icon.svg';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import type { ProfileFormValues, TeamProfileFormMode } from 'components/Team/ProfilePage/types';
import styles from './TagInput.module.scss';

interface TagInputProps {
  mode: TeamProfileFormMode;
  label: string;
  description: string;
  addButtonLabel: string;
  placeholder: string;
  onAppend?: () => void;
}

export default function TagInput({ mode, label, description, addButtonLabel, placeholder, onAppend }: TagInputProps) {
  const { control, register } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
  const skills = useWatch({ control, name: 'skills' }) ?? [];
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
          {fields.map((field, index) => {
            // edit 모드에서 이미 값이 채워진 항목은 연필 아이콘으로 수정 진입점을 보여준다 (Figma 수정 화면 기준).
            const showEditIcon = mode === 'edit' && Boolean(skills[index]?.value?.trim());
            const { ref: fieldRef, ...fieldProps } = register(`skills.${index}.value` as const);

            return (
              <li key={field.id} className={styles.tagInput__tag}>
                <input
                  type="text"
                  className={styles.tagInput__field}
                  placeholder={placeholder}
                  maxLength={30}
                  ref={(el) => {
                    fieldRef(el);
                    inputRefs.current[field.id] = el;
                  }}
                  {...fieldProps}
                />
                {showEditIcon && (
                  <button
                    type="button"
                    className={styles.tagInput__edit}
                    aria-label={`${label} ${index + 1} 수정`}
                    onClick={() => inputRefs.current[field.id]?.focus()}
                  >
                    <PencilLineIcon aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  className={styles.tagInput__remove}
                  onClick={() => remove(index)}
                  aria-label={`${label} ${index + 1} 삭제`}
                >
                  <XIcon aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className={styles.tagInput__add} onClick={handleAppend}>
        {addButtonLabel}
      </button>
    </div>
  );
}
