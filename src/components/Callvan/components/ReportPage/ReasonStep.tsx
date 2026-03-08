import { CallvanReportReasonCode } from 'api/callvan/entity';
import styles from './ReportPage.module.scss';

const MAX_CUSTOM_TEXT_LENGTH = 150;

interface ReasonOption {
  code: CallvanReportReasonCode;
  label: string;
  sublabel: string;
}

const REASON_OPTIONS: ReasonOption[] = [
  { code: 'NO_SHOW', label: '노쇼', sublabel: '참여 신청 후 약속 장소에 나타나지 않았습니다.' },
  { code: 'NON_PAYMENT', label: '비용 미납', sublabel: '콜밴 비용을 납부하지 않았습니다.' },
  { code: 'PROFANITY', label: '욕설', sublabel: '욕설, 성적인 언어, 비방하는 언어를 사용했습니다.' },
  { code: 'OTHER', label: '기타', sublabel: '' },
];

interface ReasonStepProps {
  selected: Set<CallvanReportReasonCode>;
  customText: string;
  onToggle: (code: CallvanReportReasonCode) => void;
  onCustomTextChange: (text: string) => void;
}

export default function ReasonStep({ selected, customText, onToggle, onCustomTextChange }: ReasonStepProps) {
  return (
    <div className={styles['reason-step']}>
      <h2 className={styles['reason-step__heading']}>신고 이유를 선택해주세요.</h2>
      <p className={styles['reason-step__description']}>
        신고가 접수되면 운영정책에 따라 검토 후 주변 기능이 제한될 수 있습니다. 본 서비스는 비용 정산에 직접 관여하지
        않습니다.
      </p>
      <div className={styles['reason-step__list']}>
        {REASON_OPTIONS.map((option, index) => {
          const isChecked = selected.has(option.code);
          const isOther = option.code === 'OTHER';
          return (
            <div key={option.code}>
              {index > 0 && <div className={styles['reason-step__divider']} />}
              <div className={styles['reason-item']}>
                <button
                  type="button"
                  className={styles['reason-item__row']}
                  onClick={() => onToggle(option.code)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-pressed={isChecked}
                >
                  <div
                    className={`${styles['reason-item__checkbox']} ${isChecked ? styles['reason-item__checkbox--checked'] : ''}`}
                  />
                  {isOther ? (
                    <>
                      <span className={styles['reason-item__label']}>{option.label}</span>
                      <span
                        className={`${styles['reason-item__count']} ${isChecked ? styles['reason-item__count--checked'] : ''}`}
                      >
                        {customText.length}/{MAX_CUSTOM_TEXT_LENGTH}
                      </span>
                    </>
                  ) : (
                    <div className={styles['reason-item__text']}>
                      <span className={styles['reason-item__label']}>{option.label}</span>
                      <span className={styles['reason-item__sublabel']}>{option.sublabel}</span>
                    </div>
                  )}
                </button>
                {isOther && (
                  <textarea
                    className={styles['reason-item__custom-textarea']}
                    placeholder="신고 사유를 입력해주세요."
                    value={customText}
                    maxLength={MAX_CUSTOM_TEXT_LENGTH}
                    onChange={(e) => onCustomTextChange(e.target.value)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
