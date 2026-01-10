import { Suspense } from "react";
import { redirect } from "next/navigation";

import CreateTeamProfile from "@/components/CreateTeamProfile";
import MenuButton from "@/components/returnButton";

export default async function TeamPage({ params }: { params: { team_id: string } | Promise<{ team_id: string }> }) {
  // params may be a Promise in some Next.js runtime contexts; await it to access properties safely
  const { team_id } = (await params) as { team_id: string };

  // Check if team_id is a match ID (format: number-UUID)
  const matchIdRegex = /^\d+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (matchIdRegex.test(team_id)) {
    redirect(`/search/${team_id}`);
  }

  return (
    <div className="w-screen -mx-3 px-4 ">
      <div className="bg-foreground shadow-[0_0_8px_5px_rgba(0,0,0,1)] flex flex-col p-4 w-full font-play">
        <section className="flex flex-col gap-14 py-5 md:py-10 overflow-x-scroll overflow-y-hidden">
          <MenuButton />
          <div className="">
            <Suspense fallback={<div>Loading...</div>}>
              <CreateTeamProfile />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
