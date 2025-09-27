import { Suspense } from "react";

import FuckWithProfile from "@/components/FuckWithProfile";
import MenuButton from "@/components/returnButton";

export default function Home() {
  return (
    <div className="w-474.5 bg-foreground shadow-[0_0_8px_5px_rgba(0,0,0,1)] flex flex-col p-4 font-play ">
      <section className="flex flex-col gap-14 py-8 md:py-10">
        <MenuButton />
        <div className="px-5 py-3">
          <Suspense fallback={<div>Loading...</div>}>
            <FuckWithProfile />
          </Suspense>
        </div>

        
      </section>
    </div>
  );
}
