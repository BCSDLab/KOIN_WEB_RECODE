function FindIdEmailPage() {
  const navigate = useNavigate();
  const [contactType, setContactType] = useState<string>('');

  const isFormFilled = contactType !== '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactType(e.target.value);
  };

  const onBack = () => {
    navigate(ROUTES.Auth());
  };

  const onNext = () => {
    if (contactType === 'phone') {
      navigate(ROUTES.AuthFindIdPhone());
    } else if (contactType === 'email') {
      navigate(ROUTES.AuthFindIdEmail());
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.container__wrapper}>
          <div className={styles['container__title-wrapper']}>
            <button type="button" onClick={onBack} aria-label="뒤로가기">
              <BackIcon />
            </button>
            <h1 className={styles['container__title-wrapper--title']}>아이디 찾기</h1>
          </div>
          <div className={`${styles.divider} ${styles['divider--top']}`} />

          <div className={styles['gender-wrapper']}>
            <label
              htmlFor="gender"
              className={styles.wrapper__label}
            >
              인증수단
            </label>

            <div className={styles['checkbox-wrapper']}>
              <label className={styles['checkbox-wrapper__checkbox']}>
                <input type="radio" name="contactType" value="phone" onChange={handleChange} />
                <div>휴대전화 번호</div>
              </label>
              <label className={styles['checkbox-wrapper__checkbox']}>
                <input type="radio" name="contactType" value="email" onChange={handleChange} />
                <div>이메일</div>
              </label>
            </div>

          </div>

          <div className={`${styles.divider} ${styles['divider--bottom']}`} />
        </div>
        <button
          type="button"
          onClick={onNext}
          className={cn({
            [styles['button-wrapper__next-button']]: true,
            [styles['button-wrapper__next-button--active']]: isFormFilled,
          })}
          disabled={!isFormFilled}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default FindIdEmailPage;
