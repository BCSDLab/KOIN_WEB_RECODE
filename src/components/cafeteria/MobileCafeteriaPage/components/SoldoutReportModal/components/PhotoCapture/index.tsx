import { useRef } from 'react';

import CameraAddIcon from 'assets/svg/cafeteria/soldout-report-camera-icon.svg';

import styles from './PhotoCapture.module.scss';

interface PhotoCaptureProps {
  previewUrl: string | null;
  onCapture: (file: File) => void;
}

export default function PhotoCapture({ previewUrl, onCapture }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onCapture(file);
  };

  return (
    <>
      <button type="button" className={styles['camera-box']} aria-label="품절 사진 촬영하기" onClick={handleBoxClick}>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- 사용자가 방금 찍은 로컬 파일 미리보기라 next/image 최적화 대상이 아님
          <img src={previewUrl} alt="품절 사진 미리보기" className={styles['preview-image']} />
        ) : (
          <>
            <CameraAddIcon />
            <span className={styles['camera-text']}>사진 촬영하기</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className={styles['file-input']}
        onChange={handleChange}
        aria-label="품절 사진 파일 선택"
      />
    </>
  );
}
