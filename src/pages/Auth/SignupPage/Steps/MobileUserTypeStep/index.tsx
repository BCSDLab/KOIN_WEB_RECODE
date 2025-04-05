type UserType = '학생' | '외부인';

interface MobileUserTypeStepProps {
  onSelectType: (type: UserType) => void;
}

function MobileUserTypeStep({ onSelectType }: MobileUserTypeStepProps) {
  return (
    <div>
      <button type="button" onClick={() => onSelectType('학생')}>
        한국기술교육대학교 학생
      </button>
      <button type="button" onClick={() => onSelectType('외부인')}>
        외부인
      </button>
    </div>
  );
}

export default MobileUserTypeStep;
