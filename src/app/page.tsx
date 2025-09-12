import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view"

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); // Placeholder to ensure this is a client component

  if (!session) {
    redirect("/sign-in");
  }

  return <HomeView />;
};

export default Page;