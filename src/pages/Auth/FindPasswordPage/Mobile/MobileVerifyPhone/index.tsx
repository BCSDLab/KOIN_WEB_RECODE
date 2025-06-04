interface MobileFindPasswordProps {
  onNext: () => void;
  onBack: () => void;
  goToEmailStep: () => void;
}

function MobileVerifyPhone({ onNext, onBack, goToEmailStep }: MobileFindPasswordProps) {
  return (
    <div>
      Mobile Find Password Phone Page
      <div>
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
    </div>
  );
}

export default MobileVerifyPhone;
