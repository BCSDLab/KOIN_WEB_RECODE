import { useEffect, useState } from 'react';
import { ClubEventRequest } from 'api/club/entity';
import { useClubEventDetail } from 'components/Club/ClubDetailPage/hooks/useClubEvent';
import { formatISODateTime, formatKoreanDate } from 'utils/ts/calendar';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import DetailDescription from 'components/Club/NewClubRecruitment/components/DetailDescription';
import ConfirmModal from 'components/Club/NewClubRecruitment/components/ConfirmModal';
import DatePickerModal from 'components/Club/NewClubRecruitment/components/DatePickerModal';
import ImagesUploadSlider from 'components/Club/NewClubEvent/components/ImagesUploadSlider';
import TimeSelector from 'components/Club/NewClubEvent/components/TimeSelector';
import TimePicker from 'components/Club/NewClubEvent/components/TimePicker';
import DatePicker from 'components/ui/DatePicker';
import useClubDetail from 'components/Club/ClubDetailPage/hooks/useClubdetail';
import usePutClubEvent from 'components/Club/ClubEventEditPage/hooks/usePutClubEvent';
import { useRouter } from 'next/router';
import styles from './ClubEventEditPage.module.scss';

function splitKoreanDate(date: Date): [string, string] {
  const [year, ...rest] = formatKoreanDate(date).split(' ');
  return [year, rest.join(' ')];
}

function ClubEventEditPage({ id, eventId }: { id: string, eventId: string }) {
  const logger = useLogger();
  const { clubDetail } = useClubDetail(Number(id));
  const { clubEventDetail } = useClubEventDetail(id, eventId);
  const { mutateAsync } = usePutClubEvent(Number(id));
  const isMobile = useMediaQuery();

  const [modalType, setModalType] = useState<'edit' | 'editCancel'>('edit');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isStartCalendarOpen, openStartCalendar, closeStartCalendar] = useBooleanState(false);
  const [isEndCalendarOpen, openEndCalendar, closeEndCalendar] = useBooleanState(false);
  const [isStartTimePickerOpen, openStartTimePicker, closeStartTimePicker] = useBooleanState(false);
  const [isEndTimePickerOpen, openEndTimePicker, closeEndTimePicker] = useBooleanState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState({ hour: 0, minute: 0 });

  const [formData, setFormData] = useState<ClubEventRequest>({
    name: clubEventDetail.name,
    image_urls: clubEventDetail.image_urls,
    introduce: clubEventDetail.introduce,
    content: clubEventDetail.content,
    start_date: clubEventDetail.start_date,
    end_date: clubEventDetail.end_date,
  });

  useEffect(() => {
    if (!clubEventDetail) return;

    const start = new Date(clubEventDetail.start_date);
    const end = new Date(clubEventDetail.end_date);

    setStartDate(start);
    setStartTime({ hour: start.getHours(), minute: start.getMinutes() });

    setEndDate(end);
    setEndTime({ hour: end.getHours(), minute: end.getMinutes() });
  }, [clubEventDetail]);

  const handleSubmit = async () => {
    const submitStartDate = formatISODateTime(startDate, startTime.hour, startTime.minute);
    const submitEndDate = formatISODateTime(endDate, endTime.hour, endTime.minute);

    await mutateAsync({
      eventId: Number(eventId),
      data: {
        ...formData,
        start_date: submitStartDate,
        end_date: submitEndDate,
      },
    });
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_correction_confirm',
      value: clubDetail.name,
    });
  };

  const [startYear, startRest] = splitKoreanDate(startDate);
  const [endYear, endRest] = splitKoreanDate(endDate);

  const handleClickCancelButton = () => {
    setModalType('editCancel');
    openModal();
  };

  const handleClickEditButton = () => {
    setModalType('edit');
    openModal();
  };

  const cancelEventEdit = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_correction_cancel',
      value: clubDetail.name,
    });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {!isMobile && (
        <div className={styles.header}>
          <h1 className={styles.header__title}>행사 수정</h1>
          <div className={styles['header__button-container']}>
            <button
              type="button"
              className={styles.header__button}
              onClick={handleClickCancelButton}
            >
              수정 취소
            </button>
            <button
              type="button"
              className={styles.header__button}
              onClick={handleClickEditButton}
            >
              수정 완료
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
              <div className={styles.form__label}>행사 이름</div>
              <input
                type="text"
                value={formData.name}
                className={styles.form__input}
                placeholder="행사 이름"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className={styles.form__item}>
              <div className={styles.form__label}>행사 일시</div>
              <div className={styles['form__button-container']}>
                {isMobile ? (
                  <>
                    <div className={styles['picker-container']}>
                      <button
                        type="button"
                        onClick={openStartCalendar}
                        className={styles['date-picker-button']}
                      >
                        <div>{startYear}</div>
                        <div>{startRest}</div>
                      </button>
                      <button
                        type="button"
                        className={styles['time-picker-button']}
                        onClick={openStartTimePicker}
                      >
                        <div>
                          {startTime.hour.toString().padStart(2, '0')}
                          :
                          {startTime.minute.toString().padStart(2, '0')}
                        </div>
                      </button>
                    </div>
                    <div className={styles.form__separator}>~</div>
                    <div className={styles['picker-container']}>
                      <button type="button" onClick={openEndCalendar} className={styles['date-picker-button']}>
                        <div>{endYear}</div>
                        <div>{endRest}</div>
                      </button>
                      <button
                        type="button"
                        className={styles['time-picker-button']}
                        onClick={openEndTimePicker}
                      >
                        <div>
                          {endTime.hour.toString().padStart(2, '0')}
                          :
                          {endTime.minute.toString().padStart(2, '0')}
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles['picker-container']}>
                      <DatePicker
                        selectedDate={startDate}
                        onChange={setStartDate}
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
              <div className={styles.form__label}>행사 내용</div>
              <input
                type="text"
                value={formData.introduce}
                className={styles.form__input}
                placeholder="행사 내용"
                onChange={(e) => setFormData({ ...formData, introduce: e.target.value })}
              />
            </div>
            {!isMobile && (
              <DetailDescription
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
        <ConfirmModal
          type={modalType}
          closeModal={closeModal}
          onSubmit={handleSubmit}
          onCancel={cancelEventEdit}
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
      {isStartTimePickerOpen && (
        <TimePicker
          hour={startTime.hour}
          minute={startTime.minute}
          onChange={(hour, minute) => {
            setStartTime({ hour, minute });
          }}
          onClose={closeStartTimePicker}
        />
      )}
      {isEndTimePickerOpen && (
        <TimePicker
          hour={endTime.hour}
          minute={endTime.minute}
          onChange={(hour, minute) => {
            setEndTime({ hour, minute });
          }}
          onClose={closeEndTimePicker}
        />
      )}
    </div>
  );
}

export default function ClubEventEditPageWrapper() {
  const router = useRouter();
  const { id, eventId } = router.query;
  if (!id || Array.isArray(id) || !eventId || Array.isArray(eventId)) return null;
  return <ClubEventEditPage id={id} eventId={eventId} />;
}
