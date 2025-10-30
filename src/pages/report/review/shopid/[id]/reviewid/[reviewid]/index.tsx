import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import CheckBox from 'components/Store/StoreDetailPage/components/Review/components/CheckBox';
import ReportingLabel from 'components/Store/StoreDetailPage/components/Review/components/ReportingLabel';
import useReviewReport from 'components/Store/StoreDetailPage/components/Review/components/ReviewReporting/query/useReviewReport';
import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import { toast } from 'react-toastify';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './ReviewReporting.module.scss';

interface RequestOption {
  title: string;
  content: string;
}

const REVIEW_CONTEXT = {
  notRelevant: {
    title: '주제에 맞지않음',
    content: '해당 음식점과 관련 없는 리뷰입니다.',
  },
  containsAd: {
    title: '광고가 포함된 리뷰',
    content: '리뷰에 광고성 내용이 포함되어 있습니다.',
  },
  abusiveLanguage: {
    title: '욕설 포함',
    content: '리뷰에 욕설이 포함되어 있습니다.',
  },
  personalInfo: {
    title: '개인정보 포함',
    content: '리뷰에 개인정보가 포함되어 있습니다.',
  },
  etc: {
    title: '기타',
    content: '',
  },
};

function ReviewReportingPage({ shopid, reviewid }: { shopid: string; reviewid: string }) {
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [requestOptions, setRequestOptions] = useState<RequestOption[]>([]);
  const [etcDescription, setEtcDescription] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { mutate } = useReviewReport(shopid, reviewid);
  const logger = useLogger();
  const { storeDetail } = useStoreDetail(shopid);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectOptions((prevOptions) => {
      const isSelected = prevOptions.includes(value);
      const updatedOptions = isSelected ? prevOptions.filter((option) => option !== value) : [...prevOptions, value];

      const updatedRequestOptions = isSelected
        ? requestOptions.filter((option) => option.title !== REVIEW_CONTEXT[value as keyof typeof REVIEW_CONTEXT].title)
        : [
            ...requestOptions,
            value === 'etc'
              ? { ...REVIEW_CONTEXT[value as keyof typeof REVIEW_CONTEXT], content: etcDescription }
              : REVIEW_CONTEXT[value as keyof typeof REVIEW_CONTEXT],
          ];

      setRequestOptions(updatedRequestOptions);
      return updatedOptions;
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight - 10}px`;
    }

    setRequestOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.title === REVIEW_CONTEXT.etc.title ? { ...option, content: etcDescription } : option,
      ),
    );
  }, [etcDescription]);

  const loggingReportDone = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_report_done',
      value: storeDetail.name,
    });
  };

  const handleReport = () => {
    if (selectOptions.includes('etc') && etcDescription.trim() === '') {
      toast.error('신고 사유를 입력해주세요.');
      setEtcDescription('');
      return;
    }
    const reportData = { reports: requestOptions };
    mutate(reportData);
    loggingReportDone();
    router.replace(`${ROUTES.StoreDetail({ id: shopid, isLink: true })}?state=리뷰`);
  };

  return (
    <div className={styles['reporting-container']}>
      <div>
        <div className={styles['reporting-title']}>신고 이유를 선택해주세요.</div>
        <div className={styles['reporting-subtitle-box']}>
          <p className={styles['reporting-subtitle']}>접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.</p>
          <p className={styles['reporting-subtitle']}>블라인드 처리까지 시간이 소요될 수 있습니다.</p>
        </div>
      </div>
      <div className={styles['option-container']}>
        {Object.keys(REVIEW_CONTEXT).map((key) => (
          <div key={key} className={key === 'etc' ? styles['reporting-option--etc'] : styles['reporting-option']}>
            <CheckBox value={key} name="reason" checked={selectOptions.includes(key)} onChange={handleChange}>
              <ReportingLabel
                title={REVIEW_CONTEXT[key as keyof typeof REVIEW_CONTEXT].title}
                description={
                  key === 'etc'
                    ? `${etcDescription.length}/150 자`
                    : REVIEW_CONTEXT[key as keyof typeof REVIEW_CONTEXT].content
                }
                disable={etcDescription.length === 150}
              />
            </CheckBox>
          </div>
        ))}
        <textarea
          ref={textareaRef}
          className={cn({
            [styles['etc-description']]: true,
            [styles['etc-description--active']]: selectOptions.includes('etc'),
          })}
          disabled={!selectOptions.includes('etc')}
          placeholder="신고 사유를 입력해주세요."
          maxLength={150}
          value={etcDescription}
          onChange={(e) => {
            if (e.target.value.length <= 150) {
              setEtcDescription(e.target.value);
            }
          }}
        />
      </div>
      <button
        className={cn({
          [styles['reporting-button']]: true,
          [styles['reporting-button--active']]: selectOptions.length > 0,
        })}
        type="submit"
        onClick={handleReport}
        disabled={selectOptions.length === 0}
      >
        신고하기
      </button>
    </div>
  );
}

export default function ReviewReportingPageWrapper() {
  const router = useRouter();
  const { id, reviewid } = router.query;
  if (typeof id !== 'string' || typeof reviewid !== 'string') return null;
  return <ReviewReportingPage shopid={id} reviewid={reviewid} />;
}

ReviewReportingPageWrapper.requireAuth = true;
