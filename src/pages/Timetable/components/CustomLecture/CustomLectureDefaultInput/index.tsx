import styles from './CustomLectureDefaultInput.module.scss';

interface Props {
  title:string;
  placeholder:string;
  require:boolean;
}

function CustomLectureDefaultInput({ title, placeholder, require }:Props) {
  return (
    <div className={styles['form-group']}>
      <label htmlFor="courseName">
        <div className={styles['form-group__title']}>
          {title}
          {require && <span className={styles['require-mark']}>*</span>}
        </div>
      </label>
      <div className={styles['form-group__block']} />
      <input type="text" id="courseName" name="courseName" placeholder={placeholder} />
    </div>
  );
}

export default CustomLectureDefaultInput;
