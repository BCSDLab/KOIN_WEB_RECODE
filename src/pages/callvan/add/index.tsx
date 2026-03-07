import AddPostForm from 'components/Callvan/components/AddPostForm';

export default function CallvanAddPage() {
  return <AddPostForm />;
}

CallvanAddPage.getLayout = (page: React.ReactNode) => <>{page}</>;
CallvanAddPage.requireAuth = true;
