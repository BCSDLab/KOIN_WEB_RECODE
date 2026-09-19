import { useRef } from 'react';

import PencilLineIcon from 'assets/svg/Team/pencil-line-icon.svg';
import XIcon from 'assets/svg/Team/x-icon.svg';
import type { ProfileFormValues, TeamProfileFormMode } from 'components/Team/ProfilePage/types';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

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
    <div className={styles['tag-input']}>
      <div className={styles['tag-input__head']}>
        <span className={styles['tag-input__label']}>{label}</span>
        <p className={styles['tag-input__description']}>{description}</p>
      </div>

      {fields.length > 0 && (
        <ul className={styles['tag-input__list']}>
          {fields.map((field, index) => {
            const showEditIcon = mode === 'edit' && Boolean(skills[index]?.value?.trim());
            const { ref: fieldRef, ...fieldProps } = register(`skills.${index}.value` as const);

            return (
              <li key={field.id} className={styles['tag-input__tag']}>
                <input
                  type="text"
                  className={styles['tag-input__field']}
                  placeholder={placeholder}
                  maxLength={20}
                  ref={(el) => {
                    fieldRef(el);
                    inputRefs.current[field.id] = el;
                  }}
                  {...fieldProps}
                />
                {showEditIcon && (
                  <button
                    type="button"
                    className={styles['tag-input__edit']}
                    aria-label={`${label} ${index + 1} 수정`}
                    onClick={() => inputRefs.current[field.id]?.focus()}
                  >
                    <PencilLineIcon aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  className={styles['tag-input__remove']}
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

      <button type="button" className={styles['tag-input__add']} onClick={handleAppend}>
        {addButtonLabel}
      </button>
    </div>
  );
}
