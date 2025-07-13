import { useState } from 'react';
import { ClubEvent } from 'api/club/entity';
import { formatKoreanDate } from 'utils/ts/calendar';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import DetailDescription from 'pages/Club/NewClubRecruitment/components/DetailDescription';
import ConfirmModal from 'pages/Club/NewClubRecruitment/components/ConfirmModal';
import DatePickerModal from 'pages/Club/NewClubRecruitment/components/DatePickerModal';
import DatePicker from 'components/ui/DatePicker';
import ImagesUploadSlider from './components/ImagesUploadSlider';
import TimeSelector from './components/TimeSelector';
import TimePicker from './components/TimePicker';
import styles from './NewClubEvent.module.scss';

export default function NewClubEvent() {
  const isMobile = useMediaQuery();

  const [modalType, setModalType] = useState('');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isStartCalendarOpen, openStartCalendar, closeStartCalendar] = useBooleanState(false);
  const [isEndCalendarOpen, openEndCalendar, closeEndCalendar] = useBooleanState(false);
  const [isTimePickerOpen, openTimePicker, closeTimePicker] = useBooleanState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState({ hour: 0, minute: 0 });

  const [formData, setFormData] = useState<ClubEvent>({
    name: '',
    image_urls: [],
    start_date: '',
    end_date: '',
    introduce: '',
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
          <h1 className={styles.header__title}>행사 생성</h1>
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
          {isMobile && (
          <ImagesUploadSlider
            imageUrls={formData.image_urls}
            addImageUrls={(newImages) => setFormData({ ...formData, image_urls: newImages })}
          />
          )}
          <div className={styles['form-left']}>
            <div className={styles.form__item}>
              <div className={styles['form__item-title']}>
                <div className={styles.form__label}>행사 이름</div>
              </div>
              <input type="text" className={styles.form__input} placeholder="행사 이름" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className={styles.form__item}>
              <div className={styles['form__item-title']}>
                <div className={styles.form__label}>행사 일시</div>
              </div>
              <div className={styles['form__button-container']}>
                {isMobile ? (
                  <>
                    <div className={styles['picker-container']}>
                      <button type="button" onClick={openStartCalendar} className={styles['date-picker-button']}>
                        <span>{startYear}</span>
                        <br />
                        <span>{startRest}</span>
                      </button>
                      <button
                        type="button"
                        className={styles['time-picker-button']}
                        onClick={openTimePicker}
                      >
                        <span>
                          {startTime.hour.toString().padStart(2, '0')}
                          :
                          {startTime.minute.toString().padStart(2, '0')}
                        </span>
                      </button>
                    </div>
                    <div className={styles.form__separator}>~</div>
                    <div className={styles['picker-container']}>
                      <button type="button" onClick={openEndCalendar} className={styles['date-picker-button']}>
                        <span>{endYear}</span>
                        <br />
                        <span>{endRest}</span>
                      </button>
                      <button
                        type="button"
                        className={styles['time-picker-button']}
                        onClick={openTimePicker}
                      >
                        <span>
                          {startTime.hour.toString().padStart(2, '0')}
                          :
                          {startTime.minute.toString().padStart(2, '0')}
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles['picker-container']}>
                      <DatePicker
                        selectedDate={startDate}
                        onChange={setStartDate}
                        trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(startDate)}</button>}
                      />
                      <TimeSelector
                        hour={startTime.hour}
                        minute={startTime.minute}
                        onChange={(time) => setStartTime(time)}
                      />
                    </div>
                    <div className={styles.form__separator}>~</div>
                    <div className={styles['picker-container']}>
                      <DatePicker
                        selectedDate={endDate}
                        onChange={setEndDate}
                        trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(endDate)}</button>}
                      />
                      <TimeSelector
                        hour={endTime.hour}
                        minute={endTime.minute}
                        onChange={(time) => setEndTime(time)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.form__item}>
              <div className={styles['form__item-title']}>
                <div className={styles.form__label}>행사 내용</div>
              </div>
              <input type="text" className={styles.form__input} placeholder="행사 내용" onChange={(e) => setFormData({ ...formData, introduce: e.target.value })} />
            </div>
            {!isMobile && (
              <DetailDescription
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
            )}
          </div>
          {!isMobile && (
          <ImagesUploadSlider
            imageUrls={formData.image_urls}
            addImageUrls={(newImages) => setFormData({ ...formData, image_urls: newImages })}
          />
          )}

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
      {isTimePickerOpen && (
        <TimePicker
          hour={startTime.hour}
          minute={startTime.minute}
          onChange={(hour, minute) => {
            setStartTime({ hour, minute });
          }}
          onClose={closeTimePicker}
        />
      )}
    </div>
  );
}
