import {
  Dispatch, SetStateAction, useCallback,
} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ClubIntrodution.module.scss';

interface ClubIntroductionProps {
  isEdit: boolean;
  introduction: string;
  setIntroduction: Dispatch<SetStateAction<string>>
}

export default function ClubIntroduction({
  isEdit,
  introduction,
  setIntroduction,
}: ClubIntroductionProps) {
  const handleChange = useCallback(
    (html: string) => {
      if (isEdit && setIntroduction) setIntroduction(html);
    },
    [isEdit, setIntroduction],
  );

  const isMobile = useMediaQuery();
  const modules = {
    toolbar: isEdit
      ? [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ]
      : false,
  };
  return (
    <div className={styles.layout}>
      {!isEdit && !isMobile && (<div className={styles['text-box']}>본문</div>)}
      <ReactQuill
        key={isEdit ? 'edit' : 'view'}
        theme="snow"
        value={introduction}
        onChange={handleChange}
        readOnly={!isEdit}
        modules={modules}
      />
    </div>
  );
}
