interface PCVerifyEmailProps {
  onNext: () => void;
  onBack: () => void;
}

function PCVerifyEmail({ onNext, onBack }: PCVerifyEmailProps) {
  return (
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
  );
}

export default PCVerifyEmail;
