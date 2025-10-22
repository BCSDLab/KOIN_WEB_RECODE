import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import CheckBox from 'components/Store/StoreDetailPage/components/Review/components/CheckBox';
import { toast } from 'react-toastify';
import useLogger from 'utils/hooks/analytics/useLogger';
import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import ROUTES from 'static/routes';
import ReportingLabel from 'components/Store/StoreDetailPage/components/Review/components/ReportingLabel';
import useReviewReport from 'components/Store/StoreDetailPage/components/Review/components/ReviewReporting/query/useReviewReport';
import { useRouter } from 'next/router';
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

function ReviewReportingPage({ shopid, reviewid }: { shopid: string, reviewid: string }) {
  const router = useRouter();
  const logger = useLogger();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [etcDescription, setEtcDescription] = useState<string>('');

  const { mutate } = useReviewReport(shopid, reviewid);
  const { storeDetail } = useStoreDetail(shopid);

  const requestOptions: RequestOption[] = selectOptions.map((key) => {
    if (key === 'etc') {
      return { ...REVIEW_CONTEXT.etc, content: etcDescription };
    }
    const context = REVIEW_CONTEXT[key as keyof typeof REVIEW_CONTEXT];
    return { title: context.title, content: context.content };
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight - 10}px`;
    }
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
          <p className={styles['reporting-subtitle']}>
            접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.
          </p>
          <p className={styles['reporting-subtitle']}>
            블라인드 처리까지 시간이 소요될 수 있습니다.
          </p>
        </div>
      </div>
      <div className={styles['option-container']}>
        {Object.keys(REVIEW_CONTEXT).map((key) => (
          <div key={key} className={key === 'etc' ? styles['reporting-option--etc'] : styles['reporting-option']}>
            <CheckBox
              value={key}
              name="reason"
              checked={selectOptions.includes(key)}
              onChange={handleChange}
            >
              <ReportingLabel
                title={REVIEW_CONTEXT[key as keyof typeof REVIEW_CONTEXT].title}
                description={key === 'etc' ? `${etcDescription.length}/150 자` : REVIEW_CONTEXT[key as keyof typeof REVIEW_CONTEXT].content}
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
