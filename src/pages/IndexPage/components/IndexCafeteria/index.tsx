import { Link } from 'react-router-dom';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  return (
    <section className={styles.template}>
      <h2 className={styles.title}>
        <span>식단</span>
        <Link to="/cafeteria" className={styles.moreLink}>더 보기</Link>
      </h2>
      <div className={styles.cafeteriaCard}>
        <div className={styles.cafeteriaContainer}>
          {CAFETERIA_CATEGORY.map((category) => (
            category.isShowMain && (
            <div key={category.id} className={styles.cafeteria}>
              {category.placeName}
            </div>
            )
          ))}
        </div>
        <div className={styles.typeContainer}>
          {CAFETERIA_TIME.map((time) => (
            <div key={time.id} className={styles.type}>
              {time.name}
            </div>
          ))}
        </div>
        <div className={styles.menuContainer}>
          {/* allMenus를 순회하는 코드 작성 */}
        </div>
      </div>
    </section>
  );
}

export default IndexCafeteria;
