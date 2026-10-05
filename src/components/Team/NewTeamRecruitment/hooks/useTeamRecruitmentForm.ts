import { zodResolver } from '@hookform/resolvers/zod';
import { teamRecruitmentFormSchema, TeamRecruitmentFormValues } from 'components/Team/NewTeamRecruitment/schema';
import { useForm } from 'react-hook-form';

function createInitialTeamRecruitmentForm(): TeamRecruitmentFormValues {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return {
    category: null,
    title: '',
    progressType: 'ONLINE',
    activityStartDate: today,
    activityEndDate: tomorrow,
    deadlineDate: new Date(today),
    isRoleUnified: false,
    roles: [],
    unifiedMemberCount: 1,
    description: '',
    relatedUrl: '',
    qualification: '',
  };
}

export default function useTeamRecruitmentForm(defaultValues?: TeamRecruitmentFormValues) {
  return useForm<TeamRecruitmentFormValues>({
    resolver: zodResolver(teamRecruitmentFormSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? createInitialTeamRecruitmentForm(),
  });
}
