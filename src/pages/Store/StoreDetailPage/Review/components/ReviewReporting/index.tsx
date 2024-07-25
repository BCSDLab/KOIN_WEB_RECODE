import RadioBox from 'components/common/CommonRadioBox';
import { useState } from 'react';
import ReportingLabel from './components/ReportingLabel';
import styles from './ReviewReporting.module.scss';

export default function ReviewReportingPage() {
  const [selectOption, setSelectOption] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectOption(event.target.value);
  };

  return (
    <div className={styles.reporting__container}>
      <div className={styles['reporting-option']}>
        <RadioBox
          value="notRelevant"
          name="reason"
          checked={selectOption === 'notRelevant'}
          onChange={handleChange}
        />
        <ReportingLabel
          title="주제에 맞지않음"
          description="해당 음식점과 관련 없는 리뷰입니다."
        />
      </div>
      <div className={styles['reporting-option']}>
        <RadioBox
          value="containsAd"
          name="reason"
          checked={selectOption === 'containsAd'}
          onChange={handleChange}
        />
        <ReportingLabel
          title="광고가 포함된 리뷰"
          description="리뷰에 광고성 내용이 포함되어 있습니다."
        />
      </div>
      <div className={styles['reporting-option']}>
        <RadioBox
          value="abusiveLanguage"
          name="reason"
          checked={selectOption === 'abusiveLanguage'}
          onChange={handleChange}
        />
        <ReportingLabel
          title="욕설 포함"
          description="리뷰에 욕설이 포함되어 있습니다."
        />
      </div>
      <div className={styles['reporting-option']}>
        <RadioBox
          value="personalInfo"
          name="reason"
          checked={selectOption === 'personalInfo'}
          onChange={handleChange}
        />
        <ReportingLabel
          title="개인정보 포함"
          description="리뷰에 개인정보가 포함되어 있습니다."
        />
      </div>
      <div className={styles['reporting-option']}>
        <RadioBox
          value="etc"
          name="reason"
          checked={selectOption === 'etc'}
          onChange={handleChange}
        />
        <ReportingLabel
          title="기타"
          description="기타 사유로 신고합니다."
        />
      </div>
      <textarea
        className={styles.etc__description}
        disabled={selectOption === 'etc'}
        placeholder="신고 사유를 입력해주세요."
      />
      <button
        className={styles.submit__button}
        type="submit"
        onClick={() => {
          console.log(selectOption);
        }}
      >
        신고하기
      </button>
    </div>
  );
}
