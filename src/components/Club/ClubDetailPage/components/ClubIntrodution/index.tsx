import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { uploadClubFile } from 'api/uploadFile';
import useTokenState from 'utils/hooks/state/useTokenState';
import type ReactQuillType from 'react-quill-new';
import styles from './ClubIntrodution.module.scss';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
}) as typeof ReactQuillType;

interface Props {
  isEdit: boolean;
  introduction: string;
  setIntroduction: Dispatch<SetStateAction<string>>;
}

export default function ClubIntroduction({ isEdit, introduction, setIntroduction }: Props) {
  const token = useTokenState();
  const quillRef = useRef<ReactQuillType>(null);

  // 이미지를 서버에 업로드하고 URL 리턴
  const uploadImage = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('multipartFile', file);
      const res = await uploadClubFile(token, formData);
      return res.file_url; // 서버에서 돌아오는 URL
    },
    [token],
  );

  // 툴바의 image 버튼을 눌렀을 때 동작
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];

      // (선택) 클라이언트 리사이즈: 필요하면 아래 resizeImage 함수 사용
      // const resized = await resizeImage(file, 1024);
      // const url = await uploadImage(resized);

      const url = await uploadImage(file);

      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const range = quill.getSelection(true);
      const idx = range?.index ?? quill.getLength();

      quill.insertEmbed(idx, 'image', url);

      quill.setSelection(idx + 1, 0);
    };
  }, [uploadImage]);

  // 모듈에 훅커 등록
  const modules = useMemo(() => {
    if (!isEdit) {
      return {};
    }
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: imageHandler },
      },
    };
  }, [isEdit, imageHandler]);

  const handleChange = useCallback(
    (html: string) => {
      if (isEdit) setIntroduction(html);
    },
    [isEdit, setIntroduction],
  );

  return (
    <div className={styles.layout}>
      <ReactQuill
        ref={quillRef}
        key={isEdit ? 'edit' : 'view'}
        theme={isEdit ? 'snow' : 'bubble'}
        value={introduction}
        onChange={handleChange}
        readOnly={!isEdit}
        modules={modules}
      />
    </div>
  );
}
