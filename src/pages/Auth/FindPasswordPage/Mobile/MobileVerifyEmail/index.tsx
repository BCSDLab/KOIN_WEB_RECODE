interface MobileFindPasswordProps {
  onNext: () => void;
  onBack: () => void;
}

function MobileVerifyEmail({ onNext, onBack }: MobileFindPasswordProps) {
  return (
    <div>
      Mobile Find Password Email Page
      <div>
        Email 인증 페이지
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
    </div>
  );
}

export default MobileVerifyEmail;
