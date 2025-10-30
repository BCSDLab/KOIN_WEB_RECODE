import { useState } from 'react';
import { ClubRecruitment } from 'api/club/entity';
import { formatKoreanDate, getYyyyMmDd } from 'utils/ts/calendar';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import DatePicker from 'components/ui/DatePicker';
import DetailDescription from 'components/Club/NewClubRecruitment/components/DetailDescription';
import ClubImageUploader from 'components/Club/NewClubRecruitment/components/ImageUploader';
import ConfirmModal from 'components/Club/NewClubRecruitment/components/ConfirmModal';
import DatePickerModal from 'components/Club/NewClubRecruitment/components/DatePickerModal';
import useClubDetail from 'components/Club/ClubDetailPage/hooks/useClubdetail';
import useClubRecruitment from 'components/Club/ClubDetailPage/hooks/useClubRecruitment';
import usePutClubRecruitment from 'components/Club/ClubRecruitmentEditPage/hooks/usePutClubRecruitment';
import { useRouter } from 'next/router';
import styles from './ClubRecruitmentEditPage.module.scss';

function splitKoreanDate(date: Date): [string, string] {
  const [year, ...rest] = formatKoreanDate(date).split(' ');
  return [year, rest.join(' ')];
}

const TODAY = getYyyyMmDd(new Date());

function ClubRecruitmentEditPage({ id }: { id: string }) {
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const { clubDetail } = useClubDetail(Number(id));
  const { clubRecruitmentData } = useClubRecruitment(Number(id));
  const { mutateAsync } = usePutClubRecruitment(Number(id));

  const [modalType, setModalType] = useState<'edit' | 'editCancel'>('edit');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isStartCalendarOpen, openStartCalendar, closeStartCalendar] = useBooleanState(false);
  const [isEndCalendarOpen, openEndCalendar, closeEndCalendar] = useBooleanState(false);

  const {
    start_date: startDate,
    end_date: endDate,
    status: recruitmentStatus,
    image_url: imageUrl,
    content: recruitmentContent,
  } = clubRecruitmentData;

  const [formData, setFormData] = useState<ClubRecruitment>({
    start_date: startDate ? startDate.replace(/\./g, '-') : TODAY,
    end_date: endDate ? endDate.replace(/\./g, '-') : TODAY,
    is_always_recruiting: recruitmentStatus === 'ALWAYS',
    image_url: imageUrl,
    content: recruitmentContent,
  });

  const handleSubmit = async () => {
    const payload = formData.is_always_recruiting
      ? {
          ...formData,
          start_date: null,
          end_date: null,
        }
      : formData;
    await mutateAsync(payload);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_correction_confirm',
      value: clubDetail.name,
    });
  };

  const [startYear, startRest] = splitKoreanDate(new Date(formData.start_date));
  const [endYear, endRest] = splitKoreanDate(new Date(formData.end_date));

  const handleClickCancelButton = () => {
    setModalType('editCancel');
    openModal();
  };

  const handleClickEditButton = () => {
    setModalType('edit');
    openModal();
  };

  const handleCancel = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_correction_cancel',
      value: clubDetail.name,
    });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {!isMobile && (
          <div className={styles.header}>
            <h1 className={styles.header__title}>모집 수정</h1>
            <div className={styles['header__button-container']}>
              <button type="button" className={styles.header__button} onClick={handleClickCancelButton}>
                수정 취소
              </button>
              <button type="button" className={styles.header__button} onClick={handleClickEditButton}>
                수정 완료
              </button>
            </div>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles['form-left']}>
            <div className={styles.form__item}>
              <div className={styles['form__item-title']}>
                <div className={styles.form__label}>모집기한</div>
                <div className={styles.form__input}>
                  <label htmlFor="period" className={styles.form__label}>
                    상시 모집
                  </label>
                  <input
                    id="period"
                    type="checkbox"
                    checked={formData.is_always_recruiting}
                    className={styles.form__checkbox}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        is_always_recruiting: !formData.is_always_recruiting,
                      });
                    }}
                  />
                </div>
              </div>
              {!formData.is_always_recruiting && (
                <div className={styles['form__button-container']}>
                  {isMobile ? (
                    <>
                      <button type="button" onClick={openStartCalendar} className={styles['date-picker-button']}>
                        <div>{startYear}</div>
                        <div>{startRest}</div>
                      </button>
                      <div className={styles.form__separator}>~</div>
                      <button type="button" onClick={openEndCalendar} className={styles['date-picker-button']}>
                        <div>{endYear}</div>
                        <div>{endRest}</div>
                      </button>
                    </>
                  ) : (
                    <>
                      <DatePicker
                        selectedDate={new Date(formData.start_date)}
                        onChange={(date) => {
                          setFormData({
                            ...formData,
                            start_date: getYyyyMmDd(date),
                          });
                        }}
                      />
                      <div className={styles.form__separator}>~</div>
                      <DatePicker
                        selectedDate={new Date(formData.end_date)}
                        onChange={(date) => {
                          setFormData({
                            ...formData,
                            end_date: getYyyyMmDd(date),
                          });
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
            {!isMobile && (
              <DetailDescription
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            )}
          </div>
          <ClubImageUploader formData={formData} setFormData={setFormData} />
          {isMobile && (
            <>
              <DetailDescription
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <div className={styles['button-group__bottom']}>
                <button
                  type="button"
                  className={styles['button-group__bottom__button']}
                  onClick={handleClickCancelButton}
                >
                  수정 취소
                </button>
                <button
                  type="button"
                  className={styles['button-group__bottom__button']}
                  onClick={handleClickEditButton}
                >
                  수정 하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConfirmModal type={modalType} closeModal={closeModal} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
      {isStartCalendarOpen && (
        <DatePickerModal
          selectedDate={new Date(formData.start_date)}
          onChange={(date) => {
            setFormData({
              ...formData,
              start_date: getYyyyMmDd(date),
            });
          }}
          onClose={closeStartCalendar}
        />
      )}
      {isEndCalendarOpen && (
        <DatePickerModal
          selectedDate={new Date(formData.end_date)}
          onChange={(date) => {
            setFormData({
              ...formData,
              end_date: getYyyyMmDd(date),
            });
          }}
          onClose={closeEndCalendar}
        />
      )}
    </div>
  );
}

export default function ClubRecruitmentEditPageWrapper() {
  const router = useRouter();

  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return <ClubRecruitmentEditPage id={id} />;
}
