import styles from './PCMenuBlocks.module.scss';

export default function PCMenuBlocks() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__place}>A코너</div>
        <div className={styles.header__detail}>786kcal • 1000원/1000원</div>
        <span className={styles.header__chip} />
      </div>

      <div className={styles.content}>
        <img
          className={styles.content__image}
          src="https://via.placeholder.com/150"
          alt="menu"
        />
        <div className={styles.content__menus}>
          <div className={styles.content__menu}>메뉴 이름</div>
          <div className={styles.content__menu}>메뉴 이름</div>
          <div className={styles.content__menu}>메뉴 이름</div>
        </div>
      </div>
    </div>
  );
}
