"use client";

import { useRouter } from "next/navigation";
import "@/./public/src/returnButton.css";

export default function MenuButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home"); // ✅ no need for .html
  };

  return (
    <button aria-label="Go to home" className="menu" onClick={handleClick}>
      <span className="arrow">&larr;</span>
    </button>
  );
}
