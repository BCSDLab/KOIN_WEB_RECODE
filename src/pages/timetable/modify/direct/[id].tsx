import ModifyTimetablePage from 'components/TimetablePage/ModifyTimetablePage';
import { useRouter } from 'next/router';

export default function ModifyDirectTimetablePage() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return <ModifyTimetablePage id={id} />;
}
