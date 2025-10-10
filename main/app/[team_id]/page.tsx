import { Suspense } from "react";

import FuckWithProfile from "@/components/FuckWithProfile";
import MenuButton from "@/components/returnButton";

export default function TeamPage() {
  return (
    <div className="w-screen -mx-3 px-4">
      <div className="bg-foreground shadow-[0_0_8px_5px_rgba(0,0,0,1)] flex flex-col p-4 w-full font-play">
        <section className="flex flex-col gap-14 py-5 md:py-10">
          <MenuButton />
          <div className="">
            <Suspense fallback={<div>Loading...</div>}>
              <FuckWithProfile />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
