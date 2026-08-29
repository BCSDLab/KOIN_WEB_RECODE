import { useRef, useState } from 'react';
import { TeamRecruitmentFormState, TeamRecruitmentProgressType } from 'components/Team/NewTeamRecruitment/types';

function createInitialTeamRecruitmentForm(): TeamRecruitmentFormState {
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

export default function useTeamRecruitmentForm() {
  const roleIdCounter = useRef(0);
  const [formData, setFormData] = useState<TeamRecruitmentFormState>(createInitialTeamRecruitmentForm);

  const isRoleValid =
    formData.isRoleUnified || (formData.roles.length > 0 && formData.roles.every((role) => role.name.trim() !== ''));

  const isScheduleValid =
    formData.activityStartDate !== null &&
    formData.activityEndDate !== null &&
    formData.deadlineDate !== null &&
    formData.activityEndDate.getTime() >= formData.activityStartDate.getTime() &&
    formData.deadlineDate.getTime() <= formData.activityStartDate.getTime();

  const isFormValid =
    formData.category !== null &&
    formData.title.trim() !== '' &&
    formData.progressType !== null &&
    isScheduleValid &&
    isRoleValid &&
    formData.description.trim() !== '';

  const setCategory = (category: string) => setFormData((prev) => ({ ...prev, category }));
  const setTitle = (title: string) => setFormData((prev) => ({ ...prev, title }));
  const setProgressType = (progressType: TeamRecruitmentProgressType) =>
    setFormData((prev) => ({ ...prev, progressType }));
  const setActivityStartDate = (date: Date) => setFormData((prev) => ({ ...prev, activityStartDate: date }));
  const setActivityEndDate = (date: Date) => setFormData((prev) => ({ ...prev, activityEndDate: date }));
  const setDeadlineDate = (date: Date) => setFormData((prev) => ({ ...prev, deadlineDate: date }));
  const setDescription = (description: string) => setFormData((prev) => ({ ...prev, description }));
  const setRelatedUrl = (relatedUrl: string) => setFormData((prev) => ({ ...prev, relatedUrl }));
  const setQualification = (qualification: string) => setFormData((prev) => ({ ...prev, qualification }));

  const addRole = () => {
    roleIdCounter.current += 1;
    setFormData((prev) => ({
      ...prev,
      roles: [...prev.roles, { id: `role-${roleIdCounter.current}`, name: '', memberCount: 1 }],
    }));
  };

  const removeRole = (id: string) => {
    setFormData((prev) => ({ ...prev, roles: prev.roles.filter((role) => role.id !== id) }));
  };

  const setRoleName = (id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.map((role) => (role.id === id ? { ...role, name } : role)),
    }));
  };

  const setRoleMemberCount = (id: string, memberCount: number) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.map((role) => (role.id === id ? { ...role, memberCount } : role)),
    }));
  };

  const toggleRoleUnified = () => setFormData((prev) => ({ ...prev, isRoleUnified: !prev.isRoleUnified }));
  const setUnifiedMemberCount = (count: number) => setFormData((prev) => ({ ...prev, unifiedMemberCount: count }));

  return {
    formData,
    isFormValid,
    setCategory,
    setTitle,
    setProgressType,
    setActivityStartDate,
    setActivityEndDate,
    setDeadlineDate,
    setDescription,
    setRelatedUrl,
    setQualification,
    addRole,
    removeRole,
    setRoleName,
    setRoleMemberCount,
    toggleRoleUnified,
    setUnifiedMemberCount,
  };
}
