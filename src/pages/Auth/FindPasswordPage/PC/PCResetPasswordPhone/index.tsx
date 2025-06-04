interface PCResetPasswordPhoneProps {
  onNext: () => void;
  onBack: () => void;
}

function PCResetPasswordPhone({ onNext, onBack }: PCResetPasswordPhoneProps) {
  return (
    <div>
      비밀번호 재설정 페이지
      <button
        type="button"
        onClick={onNext}
      >
        Next 버튼
      </button>

      <button
        type="button"
        onClick={onBack}
      >
        Back 버튼
      </button>
    </div>
  );
}

export default PCResetPasswordPhone;
