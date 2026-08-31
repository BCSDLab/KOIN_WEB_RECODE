import type { TeamRecruitmentProfileResponse } from 'api/teamRecruitmentProfile/entity';

export interface TeamProfileViewProps {
  profile: TeamRecruitmentProfileResponse | null | undefined;
  hasProfile: boolean;
  onModifyClick: () => void;
  onCreateClick: () => void;
  onCreatedRecruitmentsClick: () => void;
  onAppliedRecruitmentsClick: () => void;
}
