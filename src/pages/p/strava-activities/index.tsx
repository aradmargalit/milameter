import { Divider, Sheet } from '@mui/joy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { MilavisionAPI } from '@/apiClients/milavisionAPI/milaVisionAPI';
import { Activity } from '@/models/activity';
import ActivityGrid from '@/components/ActivityGrid';
import GarminFilePicker from '@/components/GarminFilePicker';

type Data = { activities: Activity[] };

const PAGE_SIZE = 9;

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const jwt = await getToken({
    req: context.req,
  });

  // This should never happen, but what can ya do
  if (!jwt?.accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const milavisionAPI = new MilavisionAPI(jwt.accessToken);
  const activities = await milavisionAPI.getActivities(PAGE_SIZE);

  return {
    props: {
      data: {
        activities,
      },
    },
  };
};

export default function StravaActivities({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <Sheet sx={{ margin: 4, padding: 4 }}>
        <GarminFilePicker />
        <Divider />
        <ActivityGrid activities={data.activities} />
      </Sheet>
    </main>
  );
}
