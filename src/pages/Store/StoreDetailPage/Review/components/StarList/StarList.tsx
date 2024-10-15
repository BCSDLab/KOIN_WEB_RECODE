import EmptyStar from 'assets/svg/Review/empty-star.svg';
import Star from 'assets/svg/Review/star.svg';

interface Props {
  average_rating: number;
}

export default function StarList({ average_rating }: Props) {
  const emptyStarList = new Array(5 - Math.floor(average_rating)).fill(false);
  const starList = new Array(Math.floor(average_rating)).fill(true);

  const rating = [...starList, ...emptyStarList];

  return (
    <div>
      {/* eslint-disable-next-line */}
      {rating.map((ratio, idx) => (ratio ? <Star key={idx} /> : <EmptyStar key={idx} />))}
    </div>
  );
}
