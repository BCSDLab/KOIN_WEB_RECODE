import { useEffect, useRef, useState } from 'react';

import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { storeMutations } from 'api/store/mutations';
import { storeMobileQueries, storeMobileQueryKeys } from 'api/storeMobile/queries';
import CheckIcon from 'assets/svg/Store/check-icon.svg';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useGoBack from 'utils/hooks/routing/useGoBack';
import showToast from 'utils/ts/showToast';

import styles from './ReviewReportPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/shopReview/components/ReviewReport 이전(모바일 리뷰 신고).
// 신고 이유는 서버의 신고 카테고리 목록을 그대로 쓴다
const ETC = '기타';
const ETC_MAX_LENGTH = 150;

interface ReviewReportPageProps {
  id: string;
  reviewId: string;
}

export default function ReviewReportPage({ id, reviewId }: ReviewReportPageProps) {
  const { data: categoriesData } = useSuspenseQuery(storeMobileQueries.reportCategories());

  const [selected, setSelected] = useState<string[]>([]);
  const [etcText, setEtcText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const queryClient = useQueryClient();
  const logger = useLogger();
  const goBack = useGoBack();

  const options = categoriesData.categories.map((category) => ({
    value: category.name,
    label: category.name,
    subtitle: category.detail || undefined,
    hasTextarea: category.name === ETC,
  }));

  // 데스크톱 훅(useReviewReport)은 성공 시 자체 토스트를 띄워 오라클 토스트와 겹치므로 공용 mutation을 직접 쓴다
  const { mutate } = useMutation({
    ...storeMutations.reportReview(queryClient, id, reviewId, {
      onSuccess: () => {
        // 모바일 리뷰 목록·내 리뷰는 같은 접두사(reviews) 아래에 있다
        queryClient.invalidateQueries({ queryKey: [...storeMobileQueryKeys.all, 'reviews'] });
        showToast('success', '리뷰가 신고되었어요');
        goBack(ROUTES.StoreReviews({ id }));
      },
    }),
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '리뷰 신고에 실패했어요');
      }
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [etcText]);

  const isEtcSelected = selected.includes(ETC);
  const canSubmit = selected.length > 0 && (!isEtcSelected || etcText.trim().length > 0);

  const toggleSelect = (value: string) => {
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // 기타 내용을 쓰면 기타를 자동으로 고르고, 모두 지우면 해제한다
  const handleEtcChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, ETC_MAX_LENGTH);
    setEtcText(value);

    const trimmed = value.trim();
    setSelected((prev) => {
      const hasEtc = prev.includes(ETC);
      if (trimmed.length > 0 && !hasEtc) return [...prev, ETC];
      if (trimmed.length === 0 && hasEtc) return prev.filter((v) => v !== ETC);

      return prev;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const firstOption = options.find((o) => o.value === selected[0]);
    if (!firstOption) return;

    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_report',
      value: firstOption.label,
    });

    const reports = selected
      .map((value) => options.find((o) => o.value === value))
      .filter((o): o is (typeof options)[number] => !!o)
      .map((o) => ({
        title: o.label,
        content: o.value === ETC ? etcText.trim() : (o.subtitle ?? ''),
      }));

    mutate({ reports });
  };

  return (
    <>
      <MobilePageHeader title="리뷰 신고하기" />
      <div className={styles.report}>
        <div className={styles.report__intro}>
          <span className={styles.report__title}>신고 이유를 선택해주세요.</span>
          <span className={styles.report__notice}>
            접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.
            <br />
            블라인드 처리까지 시간이 소요될 수 있습니다.
          </span>
        </div>

        <div className={styles.report__options}>
          {options.map((opt) => {
            const isEtc = opt.hasTextarea;
            const checked = selected.includes(opt.value);

            return (
              <label
                key={opt.value}
                className={cn({
                  [styles.option]: true,
                  [styles['option--bordered']]: !isEtc,
                })}
              >
                <div className={styles.option__row}>
                  <div
                    className={cn({
                      [styles.option__check]: true,
                      [styles['option__check--etc']]: isEtc,
                    })}
                  >
                    <input
                      name="reason"
                      type="checkbox"
                      value={opt.value}
                      className={styles.option__input}
                      checked={checked}
                      onChange={() => toggleSelect(opt.value)}
                    />
                    <div
                      className={cn({
                        [styles.option__circle]: true,
                        [styles['option__circle--checked']]: checked,
                      })}
                    />
                    <div
                      className={cn({
                        [styles['option__check-icon']]: true,
                        [styles['option__check-icon--checked']]: checked,
                      })}
                    >
                      <CheckIcon />
                    </div>
                  </div>

                  <div className={styles.option__content}>
                    <div className={styles.option__head}>
                      <div className={styles.option__label}>{opt.label}</div>
                      {isEtc && (
                        <div
                          className={cn({
                            [styles.option__counter]: true,
                            [styles['option__counter--active']]: etcText.length > 0,
                          })}
                        >
                          {etcText.length}/150
                        </div>
                      )}
                    </div>
                    {opt.subtitle && <div className={styles.option__subtitle}>{opt.subtitle}</div>}
                  </div>
                </div>

                {isEtc && (
                  <div className={styles['option__textarea-wrapper']}>
                    <textarea
                      ref={textareaRef}
                      className={styles.option__textarea}
                      placeholder="신고 사유를 입력해주세요."
                      value={etcText}
                      onChange={handleEtcChange}
                      rows={2}
                    />
                  </div>
                )}
              </label>
            );
          })}
          <Button
            fullWidth
            color="primary"
            state={canSubmit ? 'default' : 'disabled'}
            onClick={handleSubmit}
            className={styles.report__submit}
          >
            신고하기
          </Button>
        </div>
      </div>
    </>
  );
}
