import type { z } from 'zod';

import type { teamRecruitmentProgressTypeSchema, teamRecruitmentRoleSchema } from './schema';

export type TeamRecruitmentProgressType = z.infer<typeof teamRecruitmentProgressTypeSchema>;
export type TeamRecruitmentRole = z.infer<typeof teamRecruitmentRoleSchema>;
