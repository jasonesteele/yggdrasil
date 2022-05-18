import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import AppFrame from "../components/AppFrame";

const Signin: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <AppFrame title="Text Roleplay">
      <div>Sign-in page</div>
    </AppFrame>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Signin;
