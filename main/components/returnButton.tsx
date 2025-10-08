"use client";

import { useRouter } from "next/navigation";
import "@/./public/src/returnButton.css";

export default function MenuButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home");
  };

  return (
    <button aria-label="Go to home" className="menu" onClick={handleClick}>
      <span className="arrow">&larr;</span>
    </button>
  );
}
