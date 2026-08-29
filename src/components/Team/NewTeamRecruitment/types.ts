import { z } from 'zod';
import { teamRecruitmentProgressTypeSchema, teamRecruitmentRoleSchema } from './schema';

export type TeamRecruitmentProgressType = z.infer<typeof teamRecruitmentProgressTypeSchema>;
export type TeamRecruitmentRole = z.infer<typeof teamRecruitmentRoleSchema>;
