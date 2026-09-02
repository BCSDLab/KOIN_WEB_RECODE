import { z } from 'zod';

// ── 기본 정보 (1단계) ──────────────────────────────────────
// 현재 BasicInfoStep의 register(...) 인라인 룰을 그대로 옮긴 것.
// 학번은 학부/대학원, 입학연도에 따라 자릿수가 달라 길이 조건은 두지 않고 숫자 여부만 검증한다.
const basicInfoSchema = z.object({
  nickname: z.string().trim().min(1, '닉네임을 입력해주세요.').max(20, '닉네임은 20자 이내로 입력해주세요.'),
  department: z.string().min(1, '학과 · 학부를 선택해주세요.'),
  studentNumber: z
    .string()
    .trim()
    .min(1, '학번을 작성해주세요.')
    .regex(/^\d+$/, '학번은 숫자만 입력해주세요.'),
});

// ── 지원서 작성 (2단계) ────────────────────────────────────
const skillSchema = z.object({
  value: z.string().max(30, '기술 / 자격증은 30자 이내로 입력해주세요.'),
});

// status에 따라 필수 필드가 달라지므로 판별 유니온으로 나눈다.
// draft: ActivityHistoryField에서 작성 중인 상태 — 필드가 비어 있어도 유효한 폼 상태다.
// saved: "완료" 버튼을 눌러 확정된 상태 — handleDone이 토스트로 하던 검증을 그대로 스키마로 옮긴 것.
const activityBaseFields = {
  id: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  isOngoing: z.boolean(),
  hasBeenSaved: z.boolean(),
};

const draftActivitySchema = z.object({
  ...activityBaseFields,
  status: z.literal('draft'),
  title: z.string(),
  content: z.string(),
});

// ActivityHistoryField의 "완료" 버튼이 개별 항목을 saved로 확정하기 전에 이 스키마로 직접 검증한다.
export const savedActivitySchema = z
  .object({
    ...activityBaseFields,
    status: z.literal('saved'),
    title: z.string().trim().min(1, '활동명을 작성해주세요.').max(50, '활동명은 50자 이내로 입력해주세요.'),
    content: z.string().trim().min(1, '활동 내용을 작성해주세요.').max(1000, '활동 내용은 1000자 이내로 입력해주세요.'),
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

const activitySchema = z.discriminatedUnion('status', [draftActivitySchema, savedActivitySchema]);

const applicationSchema = z.object({
  preferredRole: z.string().trim().min(1, '선호 역할을 작성해주세요.').max(20, '선호 역할은 20자 이내로 입력해주세요.'),
  skills: z.array(skillSchema),
  activities: z.array(activitySchema),
  introduction: z.string().trim().min(1, '자기소개를 작성해주세요.').max(1000, '자기소개는 1000자 이내로 입력해주세요.'),
});

// zod v4에서 ZodObject.merge()는 deprecated라 shape를 직접 펼쳐서 합친다.
export const profileFormSchema = z.object({ ...basicInfoSchema.shape, ...applicationSchema.shape }).superRefine((data, context) => {
  // ActivityHistoryField의 "완료" 버튼을 안 눌러 draft로 남은 활동 이력이 있으면 제출 불가.
  // 지금 ProfilePage.handleRequestSubmit의 수동 체크(values.activities.some(status==='draft'))를 그대로 스키마로 옮긴 것.
  const hasDraftActivity = data.activities.some((activity) => activity.status === 'draft');
  if (hasDraftActivity) {
    context.addIssue({
      code: 'custom',
      path: ['activities'],
      message: '작성 중인 활동 이력을 완료해주세요.',
    });
  }
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ProfileActivityValue = z.infer<typeof activitySchema>;
