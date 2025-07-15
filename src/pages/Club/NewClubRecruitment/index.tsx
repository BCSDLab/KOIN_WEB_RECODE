import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClubRecruitment } from 'api/club/entity';
import { formatKoreanDate } from 'utils/ts/calendar';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import DatePicker from 'components/ui/DatePicker';
import ClubImageUploader from './components/ImageUploader';
import DetailDescription from './components/DetailDescription';
import DatePickerModal from './components/DatePickerModal';
import ConfirmModal from './components/ConfirmModal';
import usePostNewRecruitment from './hooks/usePostNewRecruitment';
import styles from './NewClubRecruitment.module.scss';

export default function NewClubRecruitment() {
  const { id } = useParams<{ id: string }>();
  const { mutateAsync } = usePostNewRecruitment(Number(id));
  const isMobile = useMediaQuery();

  const [modalType, setModalType] = useState('');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isStartCalendarOpen, openStartCalendar, closeStartCalendar] = useBooleanState(false);
  const [isEndCalendarOpen, openEndCalendar, closeEndCalendar] = useBooleanState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState<ClubRecruitment>({
    start_date: todayStr,
    end_date: todayStr,
    is_always_recruiting: false,
    image_url: '',
    content: '',
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
  };

  function splitKoreanDate(date: Date): [string, string] {
    const [year, ...rest] = formatKoreanDate(date).split(' ');
    return [year, rest.join(' ')];
  }

  const [startYear, startRest] = splitKoreanDate(new Date(formData.start_date));
  const [endYear, endRest] = splitKoreanDate(new Date(formData.end_date));

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {!isMobile && (
        <div className={styles.header}>
          <h1 className={styles.header__title}>모집 생성</h1>
          <div className={styles['header__button-container']}>
            <button type="button" className={styles.header__button} onClick={() => { setModalType('cancel'); openModal(); }}>
              생성 취소
            </button>
            <button type="button" className={styles.header__button} onClick={() => { setModalType('confirm'); openModal(); }}>
              생성 완료
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
              { !formData.is_always_recruiting && (
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
                          start_date: date.toISOString().slice(0, 10),
                        });
                      }}
                      trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(new Date(formData.start_date))}</button>}
                    />
                    <div className={styles.form__separator}>~</div>
                    <DatePicker
                      selectedDate={new Date(formData.end_date)}
                      onChange={(date) => {
                        setFormData({
                          ...formData,
                          end_date: date.toISOString().slice(0, 10),
                        });
                      }}
                      trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(new Date(formData.end_date))}</button>}
                    />
                  </>
                )}
              </div>
              )}
            </div>
            {!isMobile && (
              <DetailDescription
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
            )}
          </div>
          <ClubImageUploader
            formData={formData}
            setFormData={setFormData}
          />
          {isMobile && (
            <>
              <DetailDescription
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
              <div className={styles['button-group__bottom']}>
                <button
                  type="button"
                  className={styles['button-group__bottom__button']}
                  onClick={() => { setModalType('cancel'); openModal(); }}
                >
                  생성 취소
                </button>
                <button
                  type="button"
                  className={styles['button-group__bottom__button']}
                  onClick={() => { setModalType('confirm'); openModal(); }}
                >
                  생성 하기
                </button>
              </div>
            </>

          )}
        </div>
      </div>

      {isModalOpen && (
        <ConfirmModal
          type={modalType}
          closeModal={closeModal}
          onSubmit={handleSubmit}
        />
      )}
      {isStartCalendarOpen && (
        <DatePickerModal
          selectedDate={new Date(formData.start_date)}
          onChange={(date) => {
            setFormData({
              ...formData,
              start_date: date.toISOString().slice(0, 10),
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
              end_date: date.toISOString().slice(0, 10),
            });
          }}
          onClose={closeEndCalendar}
        />
      )}
    </div>
  );
}
