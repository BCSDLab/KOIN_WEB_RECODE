import useShuttleTimetableDetail from 'pages/BusTimetablePage/hooks/useShuttleTimetableDetail';
import { useEffect } from 'react';

interface ShuttleTimetableDetailProps {
  routeId : string;
}

function BusTimetableDetail({ routeId }: ShuttleTimetableDetailProps) {
  const { shuttleTimetableDetail } = useShuttleTimetableDetail(routeId);

  useEffect(() => {
    console.log(shuttleTimetableDetail);
  }, [shuttleTimetableDetail]);

  if (!shuttleTimetableDetail) return null;

  return (
    <>
      {shuttleTimetableDetail.route_info.length <= 2 && (
        <div>
          <div>등교, 하교</div>
          <div> </div>
          <div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div>
                {name}
                {' '}
                {detail}
              </div>
            ))}
          </div>
          <div>{shuttleTimetableDetail.region}</div>
          <div>{shuttleTimetableDetail.route_name}</div>
          <div>{shuttleTimetableDetail.route_type}</div>
          <div>
            {shuttleTimetableDetail.route_info.map(({ name, detail, arrival_time }) => (
              <div>
                {name}
                {' '}
                {detail}
                {' '}
                {arrival_time.map((time) => (
                  <span>
                    {time}
                    {' '}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {shuttleTimetableDetail.route_info.length > 2 && (
        <div>
          <div>등교, 하교</div>
          <div> </div>
          <div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div>
                {name}
                {' '}
                {detail}
              </div>
            ))}
          </div>
          <div>{shuttleTimetableDetail.region}</div>
          <div>{shuttleTimetableDetail.route_name}</div>
          <div>{shuttleTimetableDetail.route_type}</div>
          <div>
            {shuttleTimetableDetail.route_info.map(({ name, detail, arrival_time }) => (
              <div>
                {name}
                {' '}
                {detail}
                {' '}
                {arrival_time.map((time) => (
                  <span>
                    {time}
                    {' '}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default BusTimetableDetail;
