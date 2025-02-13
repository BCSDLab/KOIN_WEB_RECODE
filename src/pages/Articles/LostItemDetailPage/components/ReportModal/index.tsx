import { createPortal } from 'react-dom';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useMutation } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';
import { useUser } from 'utils/hooks/state/useUser';
import useTokenState from 'utils/hooks/state/useTokenState';
import { reportLostItemArticle } from 'api/articles';
import CloseIcon from 'assets/svg/Articles/close.svg';
import RadioGroup from 'pages/Articles/LostItemDetailPage/components/RadioGroup';
import { useState } from 'react';
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
  const { data: userInfo } = useUser();
  const token = useTokenState();

  useEscapeKeyDown({ onEscape: closeReportModal });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeReportModal });

  // 🚀 신고 API 요청
  const { mutate: reportArticle } = useMutation({
    mutationFn: (reports: { title: string; content: string }[]) => {
      if (!token) {
        showToast('error', '로그인이 필요합니다.');
        return Promise.reject(new Error('Unauthorized'));
      }
      return reportLostItemArticle(token, articleId, { reports });
    },
    onSuccess: () => {
      showToast('success', '게시글이 신고되었습니다.');
      closeReportModal();
    },
    onError: () => {
      showToast('error', '신고 접수에 실패했습니다.');
    },
  });

  const handleReportClick = () => {
    if (!userInfo) {
      showToast('error', '로그인이 필요합니다.');
      return;
    }

    const reports = [
      {
        title: '기타',
        content: '운영진 확인이 필요한 게시글입니다.',
      },
    ];
    reportArticle(reports);
  };

  const [selectedReason, setSelectedReason] = useState('');

  return createPortal(
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles.modal__close}>
          <button type="button" onClick={closeReportModal} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.modal__title}>신고 이유를 선택해주세요.</div>
        <div>접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.</div>
        <div>블라인드 처리까지 시간이 소요될 수 있습니다.</div>

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
