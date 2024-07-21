import { useNavigate } from 'react-router-dom';
import { BusType, BUS_TYPES } from 'static/bus';
import useMobileBusCarousel from './useMobileBusCarousel';

export interface BusRedirection {
  label: string;
  link: string;
  key: string;
  type: BusType;
}

const useBusRedirection = (setSelectedTab?: (type: BusType) => void) => {
  const navigate = useNavigate();
  const {
    matchToMobileType,
  } = useMobileBusCarousel();

  const busRedirections: BusRedirection[] = [
    {
      label: '유니버스 바로가기',
      link: 'https://koreatech.unibus.kr/',
      key: 'shuttle',
      type: BUS_TYPES[0],
    },
    {
      label: '시간표 보러가기',
      link: '/bus',
      key: 'express',
      type: BUS_TYPES[1],
    },
    {
      label: '시간표 보러가기',
      link: '/bus',
      key: 'city',
      type: BUS_TYPES[2],
    },
  ];

  const getRedirection = (type: string): BusRedirection => {
    const redirections = matchToMobileType(busRedirections);
    return redirections.find((redirection) => redirection.key === type) || {
      label: '시간표 보러가기', link: '/bus', key: 'shuttle', type: BUS_TYPES[0],
    };
  };

  const handleRedirectionClick = (link: string, key:string) => {
    if (link.includes('https')) {
      window.open(link, '_blank');
    } else {
      const selectedTab = BUS_TYPES.find((busType) => busType.key === key);
      if (setSelectedTab && selectedTab) {
        setSelectedTab(selectedTab);
      }
      navigate(link);
    }
  };

  return { getRedirection, handleRedirectionClick };
};

export default useBusRedirection;
