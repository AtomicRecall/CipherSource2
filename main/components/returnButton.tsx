"use client"; // 👈 required for onClick + navigation

import { useRouter } from "next/navigation";
import "@/./public/src/returnButton.css";

export default function MenuButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home.html"); // 👈 always goes to /home
  };

  return (
    <div className="menu" onClick={handleClick}>
      <span className="arrow">&larr;</span>
    </div>
  );
}
