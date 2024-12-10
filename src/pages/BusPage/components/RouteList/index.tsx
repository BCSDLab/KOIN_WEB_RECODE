import BusRoute from 'pages/BusPage/components/BusRoute';
import { BusType } from 'pages/BusPage/ts/busModules';
import styles from './RouteList.module.scss';

interface RouteType {
  busType: BusType,
  routeName: string,
  departTime: string,
}

export default function RouteList() {
  const routes: RouteType[] = [{ busType: 'city', routeName: '400', departTime: '12:56' }];

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {routes.map(({ busType, routeName, departTime }) => (
          <BusRoute
            busType={busType}
            routeName={routeName}
            departTime={departTime}
          />
        ))}
      </div>
    </div>
  );
}
