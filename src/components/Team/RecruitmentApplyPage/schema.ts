import { z } from 'zod';

export const APPLY_NICKNAME_MAX_LENGTH = 20;
export const APPLY_PREFERRED_ROLE_MAX_LENGTH = 20;
export const APPLY_SKILL_MAX_LENGTH = 30;
export const APPLY_ACTIVITY_TITLE_MAX_LENGTH = 50;
export const APPLY_ACTIVITY_CONTENT_MAX_LENGTH = 1000;
export const APPLY_INTRODUCTION_MAX_LENGTH = 1000;
export const APPLY_MOTIVATION_MAX_LENGTH = 1000;
export const APPLY_AVAILABILITY_MAX_LENGTH = 100;

// 활동 이력은 모달 없이 카드 안에서 바로 작성/수정한다. 'draft'인 동안은 입력 폼이 펼쳐진 상태라
// 필드가 비어 있어도 유효한 폼 상태다. status에 따라 필수 필드가 달라지므로 판별 유니온으로 나눈다.
const applyActivityBaseFields = {
  id: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  isOngoing: z.boolean(),
  hasBeenSaved: z.boolean(),
};

const draftApplyActivitySchema = z.object({
  ...applyActivityBaseFields,
  status: z.literal('draft'),
  title: z.string(),
  content: z.string(),
});

// ActivityHistoryField의 "완료" 버튼이 개별 항목을 saved로 확정하기 전에 이 스키마로 직접 검증한다.
export const savedApplyActivitySchema = z
  .object({
    ...applyActivityBaseFields,
    status: z.literal('saved'),
    title: z.string().trim().min(1, '활동명을 작성해주세요.'),
    content: z.string().trim().min(1, '활동 내용을 작성해주세요.'),
    startDate: z.string().min(1, '활동 시작일을 선택해주세요.'),
  })
  .superRefine((activity, context) => {
    if (activity.isOngoing) return;

    if (!activity.endDate) {
      context.addIssue({ code: 'custom', path: ['endDate'], message: '활동 종료일을 선택하거나 진행 중을 선택해주세요.' });
      return;
    }
    if (activity.endDate < activity.startDate) {
      context.addIssue({ code: 'custom', path: ['endDate'], message: '활동 종료일은 시작일 이후로 선택해주세요.' });
    }
  });

export const applyActivitySchema = z.discriminatedUnion('status', [
  draftApplyActivitySchema,
  savedApplyActivitySchema,
]);

const applicationFormBaseSchema = z.object({
  nickname: z.string(),
  department: z.string(),
  studentNumber: z.string(),
  preferredRole: z.string(),
  skills: z.array(z.object({ value: z.string() })),
  activities: z.array(applyActivitySchema),
  introduction: z.string(),
  roleId: z.number().nullable(),
  motivation: z.string(),
  availability: z.string(),
});

export const createApplicationFormSchema = (isGeneralRecruitment: boolean) =>
  applicationFormBaseSchema.superRefine((data, context) => {
    if (data.nickname.trim() === '') {
      context.addIssue({ code: 'custom', path: ['nickname'], message: '닉네임을 입력해주세요.' });
    } else if (data.nickname.trim().length > APPLY_NICKNAME_MAX_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['nickname'],
        message: `닉네임은 ${APPLY_NICKNAME_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    if (data.department.trim() === '') {
      context.addIssue({ code: 'custom', path: ['department'], message: '학과 · 학부를 선택해주세요.' });
    }

    if (data.studentNumber.trim() === '') {
      context.addIssue({ code: 'custom', path: ['studentNumber'], message: '학번을 작성해주세요.' });
    }

    if (data.preferredRole.trim() === '') {
      context.addIssue({ code: 'custom', path: ['preferredRole'], message: '선호 역할을 작성해주세요.' });
    } else if (data.preferredRole.trim().length > APPLY_PREFERRED_ROLE_MAX_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['preferredRole'],
        message: `선호 역할은 ${APPLY_PREFERRED_ROLE_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    const skillValues = data.skills.map((skill) => skill.value.trim());
    if (skillValues.some((value) => value === '')) {
      context.addIssue({ code: 'custom', path: ['skills'], message: '빈 항목을 삭제하거나 내용을 입력해주세요.' });
    } else if (new Set(skillValues).size !== skillValues.length) {
      context.addIssue({ code: 'custom', path: ['skills'], message: '중복되지 않은 값을 입력해주세요.' });
    }

    // 개별 활동 이력의 제목/날짜/내용 검증은 applyActivitySchema(discriminated union)가 담당한다.
    // 여기서는 "완료" 버튼을 안 눌러 draft로 남은 활동 이력이 있는지만 확인한다.
    if (data.activities.some((activity) => activity.status === 'draft')) {
      context.addIssue({ code: 'custom', path: ['activities'], message: '작성 중인 활동 이력을 완료해주세요.' });
    }

    if (data.introduction.trim() === '') {
      context.addIssue({ code: 'custom', path: ['introduction'], message: '자기소개를 작성해주세요.' });
    } else if (data.introduction.length > APPLY_INTRODUCTION_MAX_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['introduction'],
        message: `자기소개는 ${APPLY_INTRODUCTION_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    if (!isGeneralRecruitment && data.roleId === null) {
      context.addIssue({ code: 'custom', path: ['roleId'], message: '지원 역할을 선택해주세요.' });
    }

    if (data.motivation.trim() === '') {
      context.addIssue({ code: 'custom', path: ['motivation'], message: '지원 동기를 작성해주세요.' });
    } else if (data.motivation.length > APPLY_MOTIVATION_MAX_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['motivation'],
        message: `지원 동기는 ${APPLY_MOTIVATION_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    if (data.availability.trim() === '') {
      context.addIssue({ code: 'custom', path: ['availability'], message: '참여 가능 시간을 작성해주세요.' });
    } else if (data.availability.length > APPLY_AVAILABILITY_MAX_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['availability'],
        message: `참여 가능 시간은 ${APPLY_AVAILABILITY_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }
  });

export type ApplyActivityValue = z.infer<typeof applyActivitySchema>;

export type ApplicationFormValues = z.infer<typeof applicationFormBaseSchema>;
