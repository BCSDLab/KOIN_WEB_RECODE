import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { useParams } from 'react-router-dom';
import CheckBox from 'components/common/CommonCheckBox';
import ReportingLabel from './components/ReportingLabel';
import styles from './ReviewReporting.module.scss';
import useReviewReport from './query/useReviewReport';
import getTitle from './query/getTitle';
import getContent from './query/getContent';

interface RequestOption {
  title: string;
  content: string;
}

export default function ReviewReportingPage() {
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [requestOptions, setRequestOptions] = useState<RequestOption[]>([]);
  const [etcDescription, setEtcDescription] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const params = useParams<{ shopid: string; reviewid: string }>();
  const { mutate } = useReviewReport(params.shopid!, params.reviewid!);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectOptions((prevOptions) => {
      const isSelected = prevOptions.includes(value);
      const updatedOptions = isSelected
        ? prevOptions.filter((option) => option !== value)
        : [...prevOptions, value];

      const updatedRequestOptions = isSelected
        ? requestOptions.filter((option) => option.title !== getTitle(value))
        : [
          ...requestOptions,
          {
            title: getTitle(value),
            content: value === 'etc' ? etcDescription : getContent(value),
          },
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

    setRequestOptions((prevOptions) => prevOptions.map((option) => (option.title === '기타'
      ? { ...option, content: etcDescription }
      : option)));
  }, [etcDescription]);

  const handleReport = () => {
    const reportData = { reports: requestOptions };
    mutate(reportData);
  };

  return (
    <div className={styles['reporting-container']}>
      <div>
        <div className={styles['reporting-title']}>신고 이유를 선택해주세요.</div>
        <div className={styles['reporting-subtitle']}>
          접수된 신고는 관계자 확인 하에 블라인드 처리됩니다.
          <br />
          블라인드 처리까지 시간이 소요될 수 있습니다.
        </div>
      </div>
      <div className={styles['option-container']}>
        <div className={styles['reporting-option']}>
          <CheckBox
            value="notRelevant"
            name="reason"
            checked={selectOptions.includes('notRelevant')}
            onChange={handleChange}
          />
          <ReportingLabel
            title="주제에 맞지않음"
            description="해당 음식점과 관련 없는 리뷰입니다."
            active={false}
          />
        </div>
        <div className={styles['reporting-option']}>
          <CheckBox
            value="containsAd"
            name="reason"
            checked={selectOptions.includes('containsAd')}
            onChange={handleChange}
          />
          <ReportingLabel
            title="광고가 포함된 리뷰"
            description="리뷰에 광고성 내용이 포함되어 있습니다."
            active={false}
          />
        </div>
        <div className={styles['reporting-option']}>
          <CheckBox
            value="abusiveLanguage"
            name="reason"
            checked={selectOptions.includes('abusiveLanguage')}
            onChange={handleChange}
          />
          <ReportingLabel
            title="욕설 포함"
            description="리뷰에 욕설이 포함되어 있습니다."
            active={false}
          />
        </div>
        <div className={styles['reporting-option']}>
          <CheckBox
            value="personalInfo"
            name="reason"
            checked={selectOptions.includes('personalInfo')}
            onChange={handleChange}
          />
          <ReportingLabel
            title="개인정보 포함"
            description="리뷰에 개인정보가 포함되어 있습니다."
            active={false}
          />
        </div>
        <div className={styles['reporting-option--etc']}>
          <CheckBox
            value="etc"
            name="reason"
            checked={selectOptions.includes('etc')}
            onChange={handleChange}
          />
          <ReportingLabel
            title="기타"
            description={`${etcDescription.length}/150 자`}
            active={selectOptions.includes('etc')}
          />
        </div>
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
          onChange={(e) => setEtcDescription(e.target.value)}
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
