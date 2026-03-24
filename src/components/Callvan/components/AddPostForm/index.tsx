import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { CALLVAN_POST_LOCATION_LABEL, CallvanPostLocationType } from 'api/callvan/entity';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import SwapIcon from 'assets/svg/Callvan/swap.svg';
import DateDropdown from 'components/Callvan/components/DateDropdown';
import LocationBottomSheet from 'components/Callvan/components/LocationBottomSheet';
import TimeDropdown from 'components/Callvan/components/TimeDropdown';
import useCallvanToast from 'components/Callvan/hooks/useCallvanToast';
import useCreateCallvan from 'components/Callvan/hooks/useCreateCallvan';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './AddPostForm.module.scss';

interface FormState {
  departureType: CallvanPostLocationType | null;
  departureCustomName: string;
  arrivalType: CallvanPostLocationType | null;
  arrivalCustomName: string;
  departureDate: Date;
  departureHour: number;
  departureMinute: number;
  isPM: boolean;
  maxParticipants: number;
}

function formatTime(hour: number, minute: number, isPM: boolean): string {
  const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function formatDateParam(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

function getLocationLabel(type: CallvanPostLocationType | null, customName: string): string {
  if (!type) return '';
  if (type === 'CUSTOM') return customName || '직접입력';
  return CALLVAN_POST_LOCATION_LABEL[type];
}

export default function AddPostForm() {
  const router = useRouter();
  const logger = useLogger();
  const { open: openToast } = useCallvanToast();
  const { mutate, isPending } = useCreateCallvan();

  const [form, setForm] = useState<FormState>({
    departureType: null,
    departureCustomName: '',
    arrivalType: null,
    arrivalCustomName: '',
    departureDate: new Date(),
    departureHour: 12,
    departureMinute: 0,
    isPM: false,
    maxParticipants: 2,
  });

  const [departureSheetOpen, setDepartureSheetOpen] = useState(false);
  const [arrivalSheetOpen, setArrivalSheetOpen] = useState(false);

  const isFormValid =
    form.departureType !== null &&
    form.arrivalType !== null &&
    (form.departureType !== 'CUSTOM' || form.departureCustomName.trim() !== '') &&
    (form.arrivalType !== 'CUSTOM' || form.arrivalCustomName.trim() !== '');

  const handleSwapLocation = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      departureType: prev.arrivalType,
      departureCustomName: prev.arrivalCustomName,
      arrivalType: prev.departureType,
      arrivalCustomName: prev.departureCustomName,
    }));
  }, []);

  const handleParticipantsChange = useCallback((delta: number) => {
    setForm((prev) => ({
      ...prev,
      maxParticipants: Math.min(11, Math.max(2, prev.maxParticipants + delta)),
    }));
  }, []);

  const handleSubmit = () => {
    if (!form.departureType || !form.arrivalType || isPending) return;

    const selectedDateTime = new Date(form.departureDate);
    const hour24 = form.isPM ? (form.departureHour === 12 ? 12 : form.departureHour + 12) : form.departureHour === 12 ? 0 : form.departureHour;
    selectedDateTime.setHours(hour24, form.departureMinute, 0, 0);

    if (selectedDateTime < new Date()) {
      openToast('현재 시각보다 이전 시각으로 모집글을 생성할 수 없습니다.');
      return;
    }

    const departureTime = formatTime(form.departureHour, form.departureMinute, form.isPM);

    mutate(
      {
        departure_type: form.departureType,
        departure_custom_name: form.departureType === 'CUSTOM' ? form.departureCustomName : null,
        arrival_type: form.arrivalType,
        arrival_custom_name: form.arrivalType === 'CUSTOM' ? form.arrivalCustomName : null,
        departure_date: formatDateParam(form.departureDate),
        departure_time: departureTime,
        max_participants: form.maxParticipants,
      },
      {
        onSuccess: () => {
          openToast('작성되었습니다.');
          router.replace({ pathname: ROUTES.Callvan(), query: { created: '1' } });
        },
      },
    );
    logger.actionEventClick({ event_label: 'callvan_write_done', team: 'CAMPUS', value: '' });
  };

  const handleBack = () => {
    logger.actionEventClick({ event_label: 'callvan_write_back', team: 'CAMPUS', value: '' });
    router.back();
  };
  
  return (
    <div className={styles.page}>
      <header className={styles.page__header}>
        <button
          type="button"
          className={styles['page__back-button']}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <ArrowBackIcon />
        </button>
        <h1 className={styles.page__title}>콜밴팟</h1>
        <div className={styles['page__header-spacer']} />
      </header>

      <div className={styles.page__body}>
        {/* 출발 / 도착 */}
        <div className={styles['location-row']}>
          <div className={styles['location-field']}>
            <span className={styles['location-field__label']}>출발</span>
            <button
              type="button"
              className={cn({
                [styles['location-field__button']]: true,
                [styles['location-field__button--selected']]: form.departureType !== null,
              })}
              onClick={() => setDepartureSheetOpen(true)}
            >
              {form.departureType ? getLocationLabel(form.departureType, form.departureCustomName) : '출발지 선택'}
            </button>
          </div>

          <button
            type="button"
            className={styles['location-row__swap']}
            onClick={handleSwapLocation}
            aria-label="출발지/도착지 교환"
          >
            <SwapIcon />
          </button>

          <div className={styles['location-field']}>
            <span className={styles['location-field__label']}>도착</span>
            <button
              type="button"
              className={cn({
                [styles['location-field__button']]: true,
                [styles['location-field__button--selected']]: form.arrivalType !== null,
              })}
              onClick={() => setArrivalSheetOpen(true)}
            >
              {form.arrivalType ? getLocationLabel(form.arrivalType, form.arrivalCustomName) : '도착지 선택'}
            </button>
          </div>
        </div>

        {/* 출발일 */}
        <div className={styles['form-section']}>
          <div className={styles['form-section__header']}>
            <span className={styles['form-section__title']}>출발일</span>
            <span className={styles['form-section__hint']}>출발 날짜를 선택해주세요.</span>
          </div>
          <DateDropdown
            selectedDate={form.departureDate}
            onChange={(date) => setForm((prev) => ({ ...prev, departureDate: date }))}
          />
        </div>

        {/* 출발 시각 */}
        <div className={styles['form-section']}>
          <div className={styles['form-section__header']}>
            <span className={styles['form-section__title']}>출발 시각</span>
            <span className={styles['form-section__hint']}>출발 시각을 선택해주세요.</span>
          </div>
          <TimeDropdown
            value={{ hour: form.departureHour, minute: form.departureMinute, isPM: form.isPM }}
            onChange={({ hour, minute, isPM }) =>
              setForm((prev) => ({ ...prev, departureHour: hour, departureMinute: minute, isPM }))
            }
          />
        </div>

        {/* 참여 인원 */}
        <div className={styles['form-section']}>
          <div className={styles['form-section__header']}>
            <span className={styles['form-section__title']}>참여 인원</span>
            <span className={styles['form-section__hint']}>
              <strong>본인을 포함한</strong> 참여 인원 수를 선택해주세요.
            </span>
          </div>
          <div className={styles['participants-picker']}>
            <div className={styles['participants-picker__display']}>
              <span>{form.maxParticipants} 명</span>
            </div>
            <div className={styles['participants-picker__divider']} />
            <div className={styles['participants-picker__controls']}>
              <button
                type="button"
                className={styles['participants-picker__button']}
                onClick={() => handleParticipantsChange(-1)}
                disabled={form.maxParticipants <= 2}
                aria-label="인원 감소"
              >
                <span className={styles['participants-picker__icon']}>−</span>
              </button>
              <div className={styles['participants-picker__count']}>{form.maxParticipants}</div>
              <button
                type="button"
                className={styles['participants-picker__button']}
                onClick={() => handleParticipantsChange(1)}
                disabled={form.maxParticipants >= 11}
                aria-label="인원 증가"
              >
                <span className={styles['participants-picker__icon']}>+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <LocationBottomSheet
        isOpen={departureSheetOpen}
        title="출발지가 어디인가요?"
        initialType={form.departureType}
        initialCustomName={form.departureCustomName}
        onClose={() => setDepartureSheetOpen(false)}
        onConfirm={(type, customName) => {
          setForm((prev) => ({ ...prev, departureType: type, departureCustomName: customName }));
          setDepartureSheetOpen(false);
        }}
      />

      <LocationBottomSheet
        isOpen={arrivalSheetOpen}
        title="도착지가 어디인가요?"
        initialType={form.arrivalType}
        initialCustomName={form.arrivalCustomName}
        onClose={() => setArrivalSheetOpen(false)}
        onConfirm={(type, customName) => {
          setForm((prev) => ({ ...prev, arrivalType: type, arrivalCustomName: customName }));
          setArrivalSheetOpen(false);
        }}
      />

      <div className={styles.page__footer}>
        <p className={styles['page__footer-hint']}>※ 모든 항목을 다 작성해주세요.</p>
        <button
          type="button"
          className={cn({
            [styles['page__submit-button']]: true,
            [styles['page__submit-button--active']]: isFormValid,
          })}
          onClick={handleSubmit}
          disabled={!isFormValid || isPending}
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
