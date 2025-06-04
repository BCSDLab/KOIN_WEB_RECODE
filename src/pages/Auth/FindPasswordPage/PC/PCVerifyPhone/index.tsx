interface FindPasswordProps {
  onNext: () => void;
  onBack: () => void;
  goToEmailStep: () => void;
}

function PCVerifyPhone({ onNext, onBack, goToEmailStep }: FindPasswordProps) {
  return (
    <div>
      PC 폰 인증 페이지
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

      <button
        type="button"
        onClick={goToEmailStep}
      >
        goToEmailStep 버튼
      </button>
    </div>
  );
}

export default PCVerifyPhone;
