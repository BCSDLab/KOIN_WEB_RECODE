import { z } from 'zod';
import {
  TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH,
  TEAM_RECRUITMENT_MAX_ROLE_COUNT,
  TEAM_RECRUITMENT_PROGRESS_TYPES,
  TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH,
  TEAM_RECRUITMENT_TITLE_MAX_LENGTH,
} from './constants';

export const teamRecruitmentProgressTypeSchema = z.enum(TEAM_RECRUITMENT_PROGRESS_TYPES);

export const teamRecruitmentRoleSchema = z.object({
  name: z.string(),
  memberCount: z.number().min(1),
});

export const teamRecruitmentFormSchema = z
  .object({
    category: z.string().nullable(),
    title: z.string().max(TEAM_RECRUITMENT_TITLE_MAX_LENGTH),
    progressType: teamRecruitmentProgressTypeSchema.nullable(),
    activityStartDate: z.date().nullable(),
    activityEndDate: z.date().nullable(),
    deadlineDate: z.date().nullable(),
    isRoleUnified: z.boolean(),
    roles: z.array(teamRecruitmentRoleSchema).max(TEAM_RECRUITMENT_MAX_ROLE_COUNT),
    unifiedMemberCount: z.number().min(1),
    description: z.string().max(TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH),
    relatedUrl: z.string(),
    qualification: z.string().max(TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH),
  })
  .superRefine((data, ctx) => {
    if (data.category === null) {
      ctx.addIssue({ code: 'custom', path: ['category'], message: '카테고리를 선택해주세요.' });
    }

    if (data.title.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['title'], message: '제목을 입력해주세요.' });
    }

    if (data.progressType === null) {
      ctx.addIssue({ code: 'custom', path: ['progressType'], message: '진행방식을 선택해주세요.' });
    }

    if (!data.activityStartDate) {
      ctx.addIssue({ code: 'custom', path: ['activityStartDate'], message: '활동 시작일을 선택해주세요.' });
    }
    if (!data.activityEndDate) {
      ctx.addIssue({ code: 'custom', path: ['activityEndDate'], message: '활동 종료일을 선택해주세요.' });
    }
    if (!data.deadlineDate) {
      ctx.addIssue({ code: 'custom', path: ['deadlineDate'], message: '마감일을 선택해주세요.' });
    }
    if (data.activityStartDate && data.activityEndDate && data.deadlineDate) {
      if (data.activityEndDate.getTime() < data.activityStartDate.getTime()) {
        ctx.addIssue({
          code: 'custom',
          path: ['activityEndDate'],
          message: '활동 종료일은 시작일 이후여야 합니다.',
        });
      }
      if (data.deadlineDate.getTime() > data.activityStartDate.getTime()) {
        ctx.addIssue({
          code: 'custom',
          path: ['deadlineDate'],
          message: '마감일은 활동 시작일 이전이어야 합니다.',
        });
      }
    }

    if (!data.isRoleUnified) {
      if (data.roles.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['roles'], message: '역할을 추가해주세요.' });
      } else if (data.roles.some((role) => role.name.trim() === '')) {
        ctx.addIssue({ code: 'custom', path: ['roles'], message: '역할명을 입력해주세요.' });
      }
    }

    if (data.description.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['description'], message: '모집 소개를 입력해주세요.' });
    }
  });

export type TeamRecruitmentFormValues = z.infer<typeof teamRecruitmentFormSchema>;
