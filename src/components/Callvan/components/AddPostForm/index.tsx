import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { CALLVAN_POST_LOCATION_LABEL, CallvanPostLocationType } from 'api/callvan/entity';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import ChevronDownIcon from 'assets/svg/Callvan/chevron-down.svg';
import SwapIcon from 'assets/svg/Callvan/swap.svg';
import useCreateCallvan from 'components/Callvan/hooks/useCreateCallvan';
import DatePicker from 'components/ui/DatePicker';
import ROUTES from 'static/routes';
import { formatKoreanDate } from 'utils/ts/calendar';
import styles from './AddPostForm.module.scss';

interface FormState {
  departureType: CallvanPostLocationType | null;
  departureCustomName: string;
  arrivalType: CallvanPostLocationType | null;
  arrivalCustomName: string;
  departureDate: Date;
  departureHour: string;
  departureMinute: string;
  isPM: boolean;
  maxParticipants: number;
}

function formatTime(hour: string, minute: string, isPM: boolean): string {
  const h = parseInt(hour || '0', 10);
  const m = parseInt(minute || '0', 10);
  const hour24 = isPM ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
  return `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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
  const { mutate, isPending } = useCreateCallvan();

  const [form, setForm] = useState<FormState>({
    departureType: null,
    departureCustomName: '',
    arrivalType: null,
    arrivalCustomName: '',
    departureDate: new Date(),
    departureHour: '12',
    departureMinute: '00',
    isPM: false,
    maxParticipants: 2,
  });

  const isFormValid =
    form.departureType !== null &&
    form.arrivalType !== null &&
    (form.departureType !== 'CUSTOM' || form.departureCustomName.trim() !== '') &&
    (form.arrivalType !== 'CUSTOM' || form.arrivalCustomName.trim() !== '');

  const handleParticipantsChange = useCallback((delta: number) => {
    setForm((prev) => ({
      ...prev,
      maxParticipants: Math.min(11, Math.max(2, prev.maxParticipants + delta)),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.departureType || !form.arrivalType || isPending) return;

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
          router.replace(ROUTES.Callvan());
        },
      },
    );
  }, [form, isPending, mutate, router]);

  return (
    <div className={styles.page}>
      <header className={styles.page__header}>
        <button
          type="button"
          className={styles['page__back-button']}
          onClick={() => router.back()}
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
            >
              {form.departureType ? getLocationLabel(form.departureType, form.departureCustomName) : '출발지 선택'}
            </button>
          </div>

          <div className={styles['location-row__swap']} aria-hidden>
            <SwapIcon />
          </div>

          <div className={styles['location-field']}>
            <span className={styles['location-field__label']}>도착</span>
            <button
              type="button"
              className={cn({
                [styles['location-field__button']]: true,
                [styles['location-field__button--selected']]: form.arrivalType !== null,
              })}
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
          <DatePicker
            selectedDate={form.departureDate}
            onChange={(date) => setForm((prev) => ({ ...prev, departureDate: date }))}
            renderTrigger={(toggle) => (
              <button type="button" className={styles['date-trigger']} onClick={toggle}>
                <span>{formatKoreanDate(form.departureDate)}</span>
                <ChevronDownIcon />
              </button>
            )}
          />
        </div>

        {/* 출발 시각 */}
        <div className={styles['form-section']}>
          <div className={styles['form-section__header']}>
            <span className={styles['form-section__title']}>출발 시각</span>
            <span className={styles['form-section__hint']}>출발 시각을 선택해주세요.</span>
          </div>
          <div className={styles['time-picker']}>
            <button
              type="button"
              className={cn({
                [styles['time-picker__ampm']]: true,
                [styles['time-picker__ampm--pm']]: form.isPM,
              })}
              onClick={() => setForm((prev) => ({ ...prev, isPM: !prev.isPM }))}
            >
              {form.isPM ? '오후' : '오전'}
            </button>
            <div className={styles['time-picker__divider']} />
            <div className={styles['time-picker__inputs']}>
              <input
                type="number"
                className={styles['time-picker__input']}
                value={form.departureHour}
                min={1}
                max={12}
                onChange={(e) => setForm((prev) => ({ ...prev, departureHour: e.target.value }))}
                aria-label="시"
              />
              <span className={styles['time-picker__colon']}>:</span>
              <input
                type="number"
                className={styles['time-picker__input']}
                value={form.departureMinute}
                min={0}
                max={59}
                onChange={(e) => setForm((prev) => ({ ...prev, departureMinute: e.target.value }))}
                aria-label="분"
              />
            </div>
          </div>
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
