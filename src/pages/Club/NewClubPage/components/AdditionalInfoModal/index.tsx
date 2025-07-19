import { NewClubData } from 'api/club/entity';
import { useState } from 'react';
import usePostNewClub from 'pages/Club/NewClubPage/hooks/usePostNewClub';
import { getClubCategoryName } from 'utils/ts/clubCategoryMapping';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './AdditionalInfoModal.module.scss';

interface AdditionalInfoModalProps {
  closeModal: () => void;
  formData: NewClubData;
  setFormData: (data: NewClubData) => void;
}

export default function AdditionalInfoModal({
  closeModal,
  formData,
  setFormData,
}: AdditionalInfoModalProps) {
  const logger = useLogger();
  const [step, setStep] = useState(1);
  const { status, mutateAsync } = usePostNewClub();

  const handleNextStep = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_create_request_check',
      value: '확인',
    });
    setStep(2);
  };
  const handleSubmit = async () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_create_request_authority',
      value: `${formData.role}`,
    });

    const trimmedOpenChat = formData.open_chat?.trim();
    const openChatUrl = trimmedOpenChat === '' ? undefined : `https://${trimmedOpenChat}`;

    const submitData = {
      ...formData,
      open_chat: openChatUrl,
      phone_number: formData.phone_number?.replace(/-/g, '') || formData.phone_number,
    };

    await mutateAsync(submitData);
    closeModal();
  };
  return (
    <div
      className={styles['modal-background']}
      onClick={closeModal}
      role="button"
      tabIndex={0}
      onKeyDown={() => {
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        {step === 1 && (
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>생성 요청</h1>
          <div className={styles['info-group']}>
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>동아리명:</div>
              <div className={styles['info-text']}>{formData.name}</div>
            </div>
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>분과:</div>
              <div className={styles['info-text']}>{getClubCategoryName(formData.club_category_id)}</div>
            </div>
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>동아리 위치:</div>
              <div className={styles['info-text']}>{formData.location}</div>
            </div>
            {formData.instagram && (
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>인스타:</div>
              <div className={styles['info-text']}>{formData.instagram}</div>
            </div>
            )}
            {formData.google_form && (
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>구글폼:</div>
              <div className={styles['info-text']}>{formData.google_form}</div>
            </div>
            )}
            {formData.open_chat && (
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>오픈채팅:</div>
              <div className={styles['info-text']}>{formData.open_chat}</div>
            </div>
            )}
            {formData.phone_number && (
            <div className={styles['info-row']}>
              <div className={styles['info-text']}>전화번호:</div>
              <div className={styles['info-text']}>{formData.phone_number}</div>
            </div>
            )}
          </div>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>작성한 정보로 생성 하시겠습니까?</div>
          </div>
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
            <button className={styles['info-button__confirm']} type="button" onClick={handleNextStep}>확인</button>
          </div>
        </div>
        )}
        {step === 2 && (
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>권한요청</h1>
          <input
            className={styles['form__text-input']}
            type="text"
            value={formData.role}
            defaultValue=""
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="해당 동아리에서 수행하고 있는 역할을 입력해주세요."
          />
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={() => setStep(1)}>취소</button>
            <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit} disabled={status === 'pending'}>확인</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
