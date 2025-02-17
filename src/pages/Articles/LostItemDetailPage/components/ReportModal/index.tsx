import { createPortal } from 'react-dom';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import CloseIcon from 'assets/svg/Articles/close.svg';
import RadioGroup from 'pages/Articles/LostItemDetailPage/components/RadioGroup';
import { useState } from 'react';
import useReportLostItemArticle from 'pages/Articles/hooks/useReportLostItemArticle';
import showToast from 'utils/ts/showToast';
import { useNavigate } from 'react-router-dom';
import styles from './ReportModal.module.scss';

interface ReportModalProps {
  articleId: number;
  closeReportModal: () => void;
}

const options = [
  { value: '1', label: '주제와 맞지 않음', subtitle: '분실물과 관련 없는 내용입니다.' },
  { value: '2', label: '스팸', subtitle: '홍보성 글입니다.' },
  { value: '3', label: '욕설', subtitle: '비방, 모욕 등이 포함된 글입니다.' },
  { value: '4', label: '개인정보', subtitle: '개인정보가 포함된 글입니다.' },
  { value: '5', label: '기타', subtitle: '신고 사유를 입력해주세요.' },
];

export default function ReportModal({ articleId, closeReportModal }: ReportModalProps) {
  useEscapeKeyDown({ onEscape: closeReportModal });
  useBodyScrollLock();
  const navigate = useNavigate();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeReportModal });

  const [selectedReason, setSelectedReason] = useState('');
  const { mutate: reportArticle } = useReportLostItemArticle();

  const handleReportClick = () => {
    const selectedOption = options.find((option) => option.value === selectedReason);

    if (!selectedOption) {
      showToast('error', '신고 사유를 선택해주세요.');
      return;
    }

    reportArticle({
      articleId,
      reports: [{ title: selectedOption.label, content: selectedOption.subtitle }],
    });

    closeReportModal();
    navigate(-1);
  };

  return createPortal(
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles['modal__close-Modal']}>
          <button type="button" onClick={closeReportModal} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.modal__header}>
          <div className={styles.modal__title}>신고 이유를 선택해주세요.</div>
          <div>
            <div className={styles.modal__subtitle}>접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.</div>
            <div className={styles.modal__subtitle}>블라인드 처리까지 시간이 소요될 수 있습니다.</div>
          </div>
        </div>

        <RadioGroup
          name="reportReason"
          options={options}
          selectedValue={selectedReason}
          onChange={(e: any) => setSelectedReason(e.target.value)}
        />

        <div className={styles.modal__buttons}>
          <button className={styles.buttons__report} type="button" onClick={handleReportClick}>
            신고하기
          </button>
          <button className={styles.buttons__close} type="button" onClick={closeReportModal}>
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
