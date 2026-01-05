import CampusInfo from 'components/CampusInfo';

export default function WebviewCampusInfo() {
  return <CampusInfo />;
}

WebviewCampusInfo.getLayout = (page: React.ReactNode) => page;
