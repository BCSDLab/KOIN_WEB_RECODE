import { z } from 'zod';

export const APPLY_NICKNAME_MAX_LENGTH = 20;
export const APPLY_SKILL_MAX_LENGTH = 30;
export const APPLY_ACTIVITY_TITLE_MAX_LENGTH = 50;
export const APPLY_ACTIVITY_CONTENT_MAX_LENGTH = 1000;
export const APPLY_INTRODUCTION_MAX_LENGTH = 1000;
export const APPLY_MOTIVATION_MAX_LENGTH = 1000;
export const APPLY_AVAILABILITY_MAX_LENGTH = 100;

export const applyActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  isOngoing: z.boolean(),
  content: z.string(),
});

const applicationFormBaseSchema = z.object({
  nickname: z.string(),
  department: z.string(),
  studentNumber: z.string(),
  skills: z.array(z.object({ value: z.string() })),
  activities: z.array(applyActivitySchema),
  introduction: z.string(),
  roleId: z.number().nullable(),
  motivation: z.string(),
  availability: z.string(),
});

export const createApplicationFormSchema = (isGeneralRecruitment: boolean) =>
  applicationFormBaseSchema.superRefine((data, ctx) => {
    if (data.nickname.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['nickname'], message: '닉네임을 입력해주세요.' });
    } else if (data.nickname.trim().length > APPLY_NICKNAME_MAX_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['nickname'],
        message: `닉네임은 ${APPLY_NICKNAME_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    if (data.department.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['department'], message: '학과 · 학부를 선택해주세요.' });
    }

    if (data.studentNumber.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['studentNumber'], message: '학번을 작성해주세요.' });
    }

    const skillValues = data.skills.map((skill) => skill.value.trim());
    if (skillValues.some((value) => value === '')) {
      ctx.addIssue({ code: 'custom', path: ['skills'], message: '빈 항목을 삭제하거나 내용을 입력해주세요.' });
    } else if (new Set(skillValues).size !== skillValues.length) {
      ctx.addIssue({ code: 'custom', path: ['skills'], message: '중복되지 않은 값을 입력해주세요.' });
    }

    data.activities.forEach((activity, index) => {
      if (activity.title.trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['activities', index, 'title'], message: '활동명을 작성해주세요.' });
      }
      if (activity.content.trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['activities', index, 'content'], message: '활동 내용을 작성해주세요.' });
      }
      if (!activity.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['activities', index, 'startDate'],
          message: '활동 시작일을 선택해주세요.',
        });
      }
      if (!activity.isOngoing && !activity.endDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['activities', index, 'endDate'],
          message: '활동 종료일을 선택하거나 진행 중을 선택해주세요.',
        });
      }
      if (!activity.isOngoing && activity.endDate && activity.endDate < activity.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['activities', index, 'endDate'],
          message: '활동 종료일은 시작일 이후로 선택해주세요.',
        });
      }
    });

    if (data.introduction.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['introduction'], message: '자기소개를 작성해주세요.' });
    } else if (data.introduction.length > APPLY_INTRODUCTION_MAX_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['introduction'],
        message: `자기소개는 ${APPLY_INTRODUCTION_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    if (!isGeneralRecruitment && data.roleId === null) {
      ctx.addIssue({ code: 'custom', path: ['roleId'], message: '지원 역할을 선택해주세요.' });
    }

    if (data.motivation.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['motivation'], message: '지원 동기를 작성해주세요.' });
    } else if (data.motivation.length > APPLY_MOTIVATION_MAX_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['motivation'],
        message: `지원 동기는 ${APPLY_MOTIVATION_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }

    if (data.availability.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['availability'], message: '참여 가능 시간을 작성해주세요.' });
    } else if (data.availability.length > APPLY_AVAILABILITY_MAX_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['availability'],
        message: `참여 가능 시간은 ${APPLY_AVAILABILITY_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
    }
  });

export type ApplyActivityValue = z.infer<typeof applyActivitySchema>;

export type ApplicationFormValues = z.infer<typeof applicationFormBaseSchema>;
