import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

import FuckWithProfile from "@/components/FuckWithProfile";
import MenuButton from "@/components/returnButton";

export default function Home() {
  return (

    <div className="w-474.5 h-225 bg-foreground shadow-[0_0_8px_5px_rgba(0,0,0,1)] flex flex-col p-4 font-play">

      <section className="flex flex-col gap-14 py-8 md:py-10 ">
      
      <MenuButton />
      <div className="px-5 py-3">
        <FuckWithProfile  />
      </div>

        <footer className="absolute bottom-0 mt-auto w-full flex flex-col items-center justify-center ">

          <span className="text-default-600 ">&copy; AtomicRecall 2025</span>
          <p className="text-black font-bold text-shadow-lg">CS2 Alpha 1.00</p>
                
        </footer>
    </section>
    </div>
    
  );
}
