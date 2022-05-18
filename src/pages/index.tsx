import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";
import { User } from "next-auth";

const Home: NextPage = () => {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") return null;

  return (
    <AppFrame title="Text Roleplay" user={session?.user as User}>
      <div>Home page</div>
    </AppFrame>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Home;
