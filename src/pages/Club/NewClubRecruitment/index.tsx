import { useState } from 'react';
import { ClubRecruitment } from 'api/club/entity';
import { formatKoreanDate } from 'utils/ts/calendar';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import DatePicker from 'components/ui/DatePicker';
import ClubImageUploader from './components/ImageUploader';
import DetailDescription from './components/DetailDescription';
import DatePickerModal from './components/DatePickerModal';
import ConfirmModal from './components/ConfirmModal';
import styles from './NewClubRecruitment.module.scss';

export default function NewClubRecruitment() {
  const isMobile = useMediaQuery();

  const [modalType, setModalType] = useState('');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isStartCalendarOpen, openStartCalendar, closeStartCalendar] = useBooleanState(false);
  const [isEndCalendarOpen, openEndCalendar, closeEndCalendar] = useBooleanState(false);
  const [isAlwaysRecruiting,,,toggleIsAlwaysRecruiting] = useBooleanState(false);

  const [isTried] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formData, setFormData] = useState<ClubRecruitment>({
    start_date: '',
    end_date: '',
    is_always_recruiting: false,
    image_url: '',
    content: '',
  });

  function splitKoreanDate(date: Date): [string, string] {
    const [year, ...rest] = formatKoreanDate(date).split(' ');
    return [year, rest.join(' ')];
  }

  const [startYear, startRest] = splitKoreanDate(startDate);
  const [endYear, endRest] = splitKoreanDate(endDate);

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
                  <input id="period" type="checkbox" checked={isAlwaysRecruiting} className={styles.form__checkbox} onChange={toggleIsAlwaysRecruiting} />
                </div>
              </div>
              { !isAlwaysRecruiting && (
              <div className={styles['form__button-container']}>
                {isMobile ? (
                  <>
                    <button type="button" onClick={openStartCalendar} className={styles['date-picker-button']}>
                      <span>{startYear}</span>
                      <br />
                      <span>{startRest}</span>
                    </button>
                    <p>~</p>
                    <button type="button" onClick={openEndCalendar} className={styles['date-picker-button']}>
                      <span>{endYear}</span>
                      <br />
                      <span>{endRest}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <DatePicker
                      selectedDate={startDate}
                      onChange={setStartDate}
                      trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(startDate)}</button>}
                    />
                    <p>~</p>
                    <DatePicker
                      selectedDate={endDate}
                      onChange={setEndDate}
                      trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(endDate)}</button>}
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
            isTried={isTried}
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
        />
      )}
      {isStartCalendarOpen && (
        <DatePickerModal
          selectedDate={startDate}
          onChange={setStartDate}
          onClose={closeStartCalendar}
        />
      )}
      {isEndCalendarOpen && (
        <DatePickerModal
          selectedDate={endDate}
          onChange={setEndDate}
          onClose={closeEndCalendar}
        />
      )}
    </div>
  );
}
