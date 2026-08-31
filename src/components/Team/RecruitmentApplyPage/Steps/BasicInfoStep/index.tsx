import { useState } from 'react';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getUserAcademicInfo, updateAcademicInfo } from 'api/auth';
import { deptQueries } from 'api/dept/queries';
import XIcon from 'assets/svg/Team/x-icon.svg';
import DeptSelect from 'components/Team/ProfilePage/components/DeptSelect';
import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import ActivityHistoryModal from 'components/Team/RecruitmentApplyPage/components/ActivityHistoryModal';
import SkillTagInput from 'components/Team/RecruitmentApplyPage/components/SkillTagInput';
import {
  APPLY_INTRODUCTION_MAX_LENGTH,
  APPLY_NICKNAME_MAX_LENGTH,
} from 'components/Team/RecruitmentApplyPage/schema';
import { APPLY_STEPS } from 'components/Team/RecruitmentApplyPage/types';
import { Controller, useFieldArray, useFormContext, useFormState, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import type { ApplicationFormValues, ApplyActivityValue } from 'components/Team/RecruitmentApplyPage/types';
import styles from './BasicInfoStep.module.scss';

interface BasicInfoStepProps {
  onNext: () => void;
}

const LOGGING_TITLE = {
  LOAD_USER_INFO: 'team_recruitment_apply_load',
  MAJOR_SELECT: 'team_recruitment_apply_major_select',
  SKILL_ADD: 'team_recruitment_apply_skill_add',
  ACTIVITY_ADD: 'team_recruitment_apply_activity_add',
  ACTIVITY_MODIFY: 'team_recruitment_apply_activity_modify',
  NEXT: 'team_recruitment_apply_next',
};

type ActivityModalState = { mode: 'create' } | { mode: 'edit'; index: number };

export default function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const token = useTokenState();
  const { actionEventClick } = useLogger();
  const { control, register, setValue, trigger, getValues } = useFormContext<ApplicationFormValues>();
  const { errors } = useFormState({ control });
  const [activityModal, setActivityModal] = useState<ActivityModalState | null>(null);

  const nickname = useWatch({ control, name: 'nickname' }) ?? '';
  const introduction = useWatch({ control, name: 'introduction' }) ?? '';
  const activities = useWatch({ control, name: 'activities' }) ?? [];
  const { fields, append, remove, update } = useFieldArray({ control, name: 'activities' });

  const { data: deptList } = useSuspenseQuery(deptQueries.list());
  const deptOptionList = deptList.map((dept) => ({ label: dept.name, value: dept.name }));

  const { mutate: loadUserInfo, isPending } = useMutation({
    mutationFn: () => getUserAcademicInfo(token),
    onSuccess: (data) => {
      setValue('nickname', data.nickname ?? '', { shouldValidate: true });
      setValue('studentNumber', data.student_number ?? '', { shouldValidate: true });

      const isKnownDept = deptOptionList.some((option) => option.value === data.department);
      if (isKnownDept) {
        setValue('department', data.department, { shouldValidate: true });
      }

      showToast('success', '회원정보를 불러왔습니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '회원정보를 불러오지 못했습니다.');
        return;
      }
      showToast('error', '회원정보를 불러오지 못했습니다.');
      sendClientError(error);
    },
  });

  const handleLoadUserInfo = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.LOAD_USER_INFO,
      value: '회원정보 불러오기',
    });

    if (!token) {
      showToast('warning', '로그인 후 이용해주세요.');
      return;
    }
    loadUserInfo();
  };

  const { mutate: saveAcademicInfo, isPending: isSaving } = useMutation({
    mutationFn: (data: { department: string; studentNumber: string }) =>
      updateAcademicInfo(token, { department: data.department, student_number: data.studentNumber }),
    onSuccess: () => {
      actionEventClick({ team: 'CAMPUS', event_category: 'click', event_label: LOGGING_TITLE.NEXT, value: '다음' });
      onNext();
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학적 정보 수정에 실패했습니다.');
        return;
      }
      showToast('error', '학적 정보 수정에 실패했습니다.');
      sendClientError(error);
    },
  });

  const handleAddActivity = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.ACTIVITY_ADD,
      value: '활동 이력 추가',
    });
    setActivityModal({ mode: 'create' });
  };

  const handleEditActivity = (index: number) => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.ACTIVITY_MODIFY,
      value: '수정',
    });
    setActivityModal({ mode: 'edit', index });
  };

  const handleActivitySubmit = (activity: ApplyActivityValue) => {
    if (activityModal?.mode === 'edit') {
      update(activityModal.index, activity);
    } else {
      append(activity);
    }
    setActivityModal(null);
  };

  const handleNext = async () => {
    const isValid = await trigger([
      'nickname',
      'department',
      'studentNumber',
      'skills',
      'activities',
      'introduction',
    ]);
    if (!isValid) {
      showToast('warning', '필수 항목을 모두 작성해주세요.');
      return;
    }

    if (!token) {
      showToast('warning', '로그인 후 이용해주세요.');
      return;
    }

    const { department, studentNumber } = getValues();
    saveAcademicInfo({ department, studentNumber });
  };

  return (
    <div className={styles.step}>
      <StepIndicator steps={APPLY_STEPS} currentIndex={0} />

      <div className={styles.step__body}>
        <div className={styles.loadInfo}>
          <div className={styles.loadInfo__head}>
            <span className={styles.loadInfo__title}>
              <span className={styles['loadInfo__title--highlight']}>코인</span> 회원정보 불러오기
            </span>
            <span className={styles.loadInfo__description}>닉네임, 학과(학부), 학번</span>
          </div>
          <button type="button" className={styles.loadInfo__button} onClick={handleLoadUserInfo} disabled={isPending}>
            회원정보 불러오기
          </button>
        </div>

        <FormField
          label="닉네임"
          required
          maxLength={APPLY_NICKNAME_MAX_LENGTH}
          currentLength={nickname.length}
          error={errors.nickname?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
            <input
              id={controlId}
              type="text"
              className={cn({ [controlClassName]: true, [styles.grayInput]: true })}
              placeholder="닉네임을 입력해주세요."
              maxLength={APPLY_NICKNAME_MAX_LENGTH}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...register('nickname')}
            />
          )}
        </FormField>

        <FormField label="학과 · 학부" required error={errors.department?.message}>
          {({ controlId, ariaDescribedBy }) => (
            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <DeptSelect
                  id={controlId}
                  options={deptOptionList}
                  value={field.value || null}
                  placeholder="학과 · 학부를 선택해주세요."
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    actionEventClick({
                      team: 'CAMPUS',
                      event_category: 'click',
                      event_label: LOGGING_TITLE.MAJOR_SELECT,
                      value: event.target.value,
                    });
                  }}
                  disabled={isSaving}
                  ariaDescribedBy={ariaDescribedBy}
                  className={styles.grayDropdown}
                />
              )}
            />
          )}
        </FormField>

        <FormField label="학번" required error={errors.studentNumber?.message}>
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
            <input
              id={controlId}
              type="text"
              inputMode="numeric"
              className={cn({ [controlClassName]: true, [styles.grayInput]: true })}
              placeholder="학번을 작성해주세요."
              maxLength={10}
              disabled={isSaving}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...register('studentNumber')}
            />
          )}
        </FormField>

        <SkillTagInput
          label="보유기술 / 자격증"
          description="기술 / 자격증은 항목별로 하나씩 작성해주세요."
          addButtonLabel="기술 / 자격증 추가"
          placeholder="기술 / 자격증을 작성해주세요."
          onAppend={() =>
            actionEventClick({
              team: 'CAMPUS',
              event_category: 'click',
              event_label: LOGGING_TITLE.SKILL_ADD,
              value: '기술 / 자격증 추가',
            })
          }
        />

        <div className={styles.activity}>
          <div className={styles.activity__head}>
            <span className={styles.activity__label}>활동 이력</span>
            <p className={styles.activity__description}>공모전, 대외활동, 자치단체 등 활동 이력을 작성해주세요.</p>
          </div>

          {fields.length > 0 && (
            <ul className={styles.activity__list}>
              {fields.map((field, index) => {
                const activity = activities[index];
                if (!activity) return null;

                return (
                  <li key={field.id} className={styles.activityCard}>
                    <div className={styles.activityCard__head}>
                      <span className={styles.activityCard__title}>{activity.title}</span>
                      <div className={styles.activityCard__actions}>
                        <button
                          type="button"
                          className={styles.activityCard__edit}
                          onClick={() => handleEditActivity(index)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className={styles.activityCard__remove}
                          onClick={() => remove(index)}
                          aria-label="활동 이력 삭제"
                        >
                          <XIcon aria-hidden />
                        </button>
                      </div>
                    </div>
                    <dl className={styles.activityCard__meta}>
                      <dt>활동 기간</dt>
                      <dd>{`${activity.startDate} ~ ${activity.isOngoing ? '진행 중' : (activity.endDate ?? '')}`}</dd>
                      <dt>활동 내용</dt>
                      <dd>{activity.content}</dd>
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}

          <button type="button" className={styles.activity__add} onClick={handleAddActivity}>
            활동 이력 추가
          </button>
        </div>

        <FormField
          label="자기소개"
          required
          maxLength={APPLY_INTRODUCTION_MAX_LENGTH}
          currentLength={introduction.length}
          error={errors.introduction?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => {
            const { ref: introductionRef, ...introductionField } = register('introduction');
            return (
              <textarea
                id={controlId}
                className={cn({
                  [controlClassName]: true,
                  [styles.grayInput]: true,
                  [styles.introductionControl]: true,
                })}
                placeholder="자기소개를 작성해주세요."
                maxLength={APPLY_INTRODUCTION_MAX_LENGTH}
                rows={6}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                ref={(el) => {
                  introductionRef(el);
                  if (el) {
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }}
                {...introductionField}
              />
            );
          }}
        </FormField>
      </div>

      <div className={styles.step__footer}>
        <button type="button" className={styles.step__submit} onClick={handleNext} disabled={isSaving}>
          다음
        </button>
      </div>

      {activityModal && (
        <ActivityHistoryModal
          initialValue={activityModal.mode === 'edit' ? (activities[activityModal.index] ?? null) : null}
          onSubmit={handleActivitySubmit}
          onClose={() => setActivityModal(null)}
        />
      )}
    </div>
  );
}
