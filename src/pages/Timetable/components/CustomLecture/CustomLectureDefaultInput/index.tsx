import { cn } from '@bcsdlab/utils';
import React from 'react';
import styles from './CustomLectureDefaultInput.module.scss';

interface Props {
  title:string;
  placeholder:string;
  require:boolean;
  isRightInput?: boolean;
  inputValue: string;
  onInputChange: (name: string) => void;
}

function CustomLectureDefaultInput({
  title, placeholder, require, isRightInput = true, inputValue, onInputChange,
}: Props) {
  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (title === '수업명') {
      onInputChange(e.target.value);
    } else if (title === '교수명') {
      onInputChange(e.target.value);
    } else if (title === '장소') {
      onInputChange(e.target.value);
    }
  };

  return (
    <div className={cn({
      [styles['form-group']]: true,
      [styles['form-group--require']]: isRightInput,
    })}
    >
      <label htmlFor="courseName">
        <div className={styles['form-group__title']}>
          {title}
          {require && <span className={styles['require-mark']}>*</span>}
        </div>
      </label>
      <div className={styles['form-group__block']} />
      <input
        type="text"
        id="courseName"
        name="courseName"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleInputValue(e)}
        autoComplete="off"
      />
    </div>
  );
}

CustomLectureDefaultInput.defaultProps = {
  isRightInput: true,
};

export default CustomLectureDefaultInput;
