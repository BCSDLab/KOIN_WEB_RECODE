import { useState } from 'react';
import { useRouter } from 'next/router';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import useReportLostItemArticle from 'components/Articles/hooks/useReportLostItemArticle';
import CheckboxGroup from 'components/Articles/LostItemDetailPage/components/CheckboxGroup';
import { toast } from 'react-toastify';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import styles from './ReportForm.module.scss';

const options = [
  { value: '1', label: '주제와 맞지 않음', subtitle: '분실물과 관련 없는 내용입니다.' },
  { value: '2', label: '스팸', subtitle: '홍보성 글입니다.' },
  { value: '3', label: '욕설', subtitle: '비방, 모욕 등이 포함된 글입니다.' },
  { value: '4', label: '개인정보', subtitle: '개인정보가 포함된 글입니다.' },
  { value: '5', label: '기타', subtitle: '신고 사유를 입력해주세요.' },
];

interface ReportFormProps {
  articleId: number;
  onClose: () => void;
  isModal: boolean;
}

export default function ReportForm({ articleId, onClose, isModal }: ReportFormProps) {
  const { mutateAsync: reportArticle } = useReportLostItemArticle(); // 쿼리 변경 줄이고 프로미스로 처리하고 싶어서 변경
  const { logItemPostReportConfirm } = useArticlesLogger();
  const [selectedReason, setSelectedReason] = useState<string[]>([]);
  const router = useRouter();
  const navigate = router.push;

  const handleReportClick = async () => {
    if (selectedReason.length === 0) {
      showToast('error', '신고 사유를 선택해주세요.');
      return;
    }

    const selectedOptions = options.filter((option) => selectedReason.includes(option.value));
    try {
      await reportArticle({
        articleId,
        reports: selectedOptions.map((option) => ({
          title: option.label,
          content: option.subtitle,
        })),
      });
      if (isModal) {
        onClose();
      } else {
        navigate(ROUTES.Articles());
      }
    } catch {
      toast.error('신고 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }
    logItemPostReportConfirm();
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>신고 이유를 선택해주세요.</div>
        <div className={styles.subtitle__container}>
          <div className={styles.subtitle}>접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.</div>
          <div className={styles.subtitle}>블라인드 처리까지 시간이 소요될 수 있습니다.</div>
        </div>
      </div>

      <CheckboxGroup
        name="reportReason"
        options={options}
        selectedValues={selectedReason}
        onChange={(newSelectedValues) => setSelectedReason(newSelectedValues)}
      />

      <div className={styles.buttons}>
        <button className={styles.buttons__report} type="button" onClick={handleReportClick}>
          신고하기
        </button>
        <button className={styles.buttons__close} type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
