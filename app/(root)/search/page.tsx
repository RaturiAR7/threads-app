import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  ///Fetch all the users

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/unboarding");
  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>
    </section>
  );
}

export default Page;
