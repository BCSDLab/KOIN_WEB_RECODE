import ROUTES from 'static/routes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useLogger from 'utils/hooks/analytics/useLogger';
import useClubCategories from 'pages/Club/hooks/useClubCategories';
import MikeIcon from 'assets/svg/Club/mike-icon.svg';
import ExerciseIcon from 'assets/svg/Club/exercise-icon.svg';
import HobbyIcon from 'assets/svg/Club/hobby-icon.svg';
import ReligionIcon from 'assets/svg/Club/religion-icon.svg';
import BookIcon from 'assets/svg/Club/book-icon.svg';
import styles from './ClubMobileViewB.module.scss';

function ClubMobileViewB() {
  const logger = useLogger();
  const clubCategories = useClubCategories();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;

  const handleCategoryClick = (name: string, id: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_main_category',
      value: `${name}`,
    });
    const isSelected = selectedCategoryId === id;
    if (isSelected) {
      searchParams.delete('categoryId');
    } else {
      searchParams.set('categoryId', String(id));
    }
    navigate(`${ROUTES.Club()}?${searchParams.toString()}`);
  };

  return (
    <div className={styles.categories}>
      {clubCategories.map((category) => (
        <button
          className={styles.categories__button}
          key={category.id}
          type="button"
          onClick={() => handleCategoryClick(category.name, category.id)}
        >
          <div
            className={styles['categories__button-icon']}
          >
            {category.name === '공연' && <MikeIcon />}
            {category.name === '운동' && <ExerciseIcon />}
            {category.name === '종교' && <ReligionIcon />}
            {category.name === '취미' && <HobbyIcon />}
            {category.name === '학술' && <BookIcon />}
          </div>
          {category.name}
        </button>
      ))}
    </div>
  );
}
export default ClubMobileViewB;
