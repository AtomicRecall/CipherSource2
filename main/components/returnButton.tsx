"use client";

import { useRouter } from "next/navigation";
import "@/./public/src/returnButton.css";

export default function MenuButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home"); // ✅ no need for .html
  };

  return (
    <button className="menu" onClick={handleClick} aria-label="Go to home">
      <span className="arrow">&larr;</span>
    </button>
  );
}
