import { useState } from 'react';
import { useRouter } from 'next/router';
import { CallvanReportReason, CallvanReportReasonCode } from 'api/callvan/entity';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import useCallvanToast from 'components/Callvan/hooks/useCallvanToast';
import useReportCallvan from 'components/Callvan/hooks/useReportCallvan';
import ROUTES from 'static/routes';
import useUploadFile from 'utils/hooks/uploadFile/useUploadFile';
import showToast from 'utils/ts/showToast';
import DetailStep from './DetailStep';
import ReasonStep from './ReasonStep';
import styles from './ReportPage.module.scss';

interface ReportPageProps {
  postId: number;
  reportedUserId: number;
}

export default function ReportPage({ postId, reportedUserId }: ReportPageProps) {
  const router = useRouter();
  const { mutate, isPending } = useReportCallvan(postId);
  const { uploadFile, isPending: isUploading } = useUploadFile();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedReasons, setSelectedReasons] = useState<Set<CallvanReportReasonCode>>(new Set());
  const [customText, setCustomText] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const { open: openToast } = useCallvanToast();

  const toggleReason = (code: CallvanReportReasonCode) => {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
        if (code === 'OTHER') setCustomText('');
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (selectedReasons.size === 0) {
      showToast('error', '신고 사유를 1개 이상 선택해주세요.');
      return;
    }
    if (selectedReasons.has('OTHER') && customText.trim() === '') {
      showToast('error', '기타 신고 사유를 입력해주세요.');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    const reasons: CallvanReportReason[] = Array.from(selectedReasons).map((code) => ({
      reason_code: code,
      ...(code === 'OTHER' ? { custom_text: customText } : {}),
    }));

    let attachments: { attachment_type: 'IMAGE'; url: string }[] = [];
    if (images.length > 0) {
      try {
        const uploadResults = await Promise.all(
          images.map((file) => uploadFile({ domain: 'CALLVAN_REPORT', file })),
        );
        attachments = uploadResults.map((result: { file_url: string }) => ({ attachment_type: 'IMAGE' as const, url: result.file_url }));
      } catch {
        showToast('error', '이미지 업로드에 실패했습니다.');
        return;
      }
    }

    mutate(
      {
        reported_user_id: reportedUserId,
        ...(description.trim() ? { description: description.trim() } : {}),
        reasons,
        ...(attachments.length > 0 ? { attachments } : {}),
      },
      {
        onSuccess: () => {
          openToast('사용자가 신고되었습니다.');
          router.push(ROUTES.CallvanParticipants({ postId: String(postId) }));
        },
      },
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <button type="button" className={styles['page__back-button']} onClick={handleBack} aria-label="뒤로가기">
          <ArrowBackIcon />
        </button>
        <h1 className={styles.page__title}>신고하기</h1>
        <div className={styles['page__spacer']} />
      </div>

      <div className={styles.page__content}>
        {step === 1 ? (
          <ReasonStep
            selected={selectedReasons}
            customText={customText}
            onToggle={toggleReason}
            onCustomTextChange={setCustomText}
          />
        ) : (
          <DetailStep
            description={description}
            images={images}
            onDescriptionChange={setDescription}
            onImagesChange={setImages}
          />
        )}
      </div>

      <div className={styles.page__footer}>
        {step === 1 ? (
          <button
            type="button"
            className={styles['page__submit-button']}
            onClick={handleNext}
            disabled={selectedReasons.size === 0}
          >
            다음
          </button>
        ) : (
          <button type="button" className={styles['page__submit-button']} onClick={handleSubmit} disabled={isPending || isUploading}>
            신고하기
          </button>
        )}
      </div>
    </div>
  );
}
