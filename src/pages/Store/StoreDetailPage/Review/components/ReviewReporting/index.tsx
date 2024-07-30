import CheckBox from 'components/common/Common\bCheckBox';
import { useState } from 'react';
import ReportingLabel from './components/ReportingLabel';
import styles from './ReviewReporting.module.scss';

export default function ReviewReportingPage() {
  const [selectOptions, setSelectOptions] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectOptions((prevOptions) => (prevOptions.includes(value)
      ? prevOptions.filter((option) => option !== value)
      : [...prevOptions, value]));
  };

  return (
    <div className={styles.reporting__container}>
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
        />
      </div>
      <div className={styles['reporting-option']}>
        <CheckBox
          value="etc"
          name="reason"
          checked={selectOptions.includes('etc')}
          onChange={handleChange}
        />
        <ReportingLabel
          title="기타"
          description="기타 사유로 신고합니다."
        />
      </div>
      <textarea
        className={styles.etc__description}
        disabled={!selectOptions.includes('etc')}
        placeholder="신고 사유를 입력해주세요."
      />
      <button
        className={styles.submit__button}
        type="submit"
        onClick={() => {
          console.log(selectOptions);
        }}
      >
        신고하기
      </button>
    </div>
  );
}
