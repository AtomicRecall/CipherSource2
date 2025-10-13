"use client";

import "@/./public/src/returnButton.css";

export default function MenuButton() {
  const handleClick = () => {
    window.location.href = "/home";
  };

  return (
    <button aria-label="Go to home" className="menu" onClick={handleClick}>
      <span className="arrow">&larr;</span>
    </button>
  );
}
