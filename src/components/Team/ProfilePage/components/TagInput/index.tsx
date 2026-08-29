import XIcon from 'assets/svg/Team/x-icon.svg';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ProfileFormValues } from 'components/Team/ProfilePage/types';
import styles from './TagInput.module.scss';

interface TagInputProps {
  label: string;
  description: string;
  addButtonLabel: string;
  placeholder: string;
  onAppend?: () => void;
  onRemove?: (value: string) => void;
}

export default function TagInput({
  label,
  description,
  addButtonLabel,
  placeholder,
  onAppend,
  onRemove,
}: TagInputProps) {
  const { control, register, getValues } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  const handleAppend = () => {
    append({ value: '' });
    onAppend?.();
  };

  const handleRemove = (index: number) => {
    const removed = getValues(`skills.${index}.value`);
    remove(index);
    onRemove?.(removed);
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
                maxLength={30}
                {...register(`skills.${index}.value` as const)}
              />
              <button type="button" onClick={() => handleRemove(index)} aria-label={`${label} ${index + 1} 삭제`}>
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
