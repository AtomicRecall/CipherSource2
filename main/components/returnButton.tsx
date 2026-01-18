"use client";

import "@/./public/src/returnButton.css";

export default function MenuButton() {
  const handleClick = () => {
    window.location.href = "/home";
  };

  return (
    <button aria-label="Go to home" className="menu" onClick={handleClick}>
      <svg
        aria-hidden="true"
        className="home-icon"
        focusable="false"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M12 2L2 9h3v11a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9h3L12 2z" />
      </svg>
    </button>
  );
}
