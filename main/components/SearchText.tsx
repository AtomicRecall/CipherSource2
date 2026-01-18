"use client";
import { useCallback } from "react";

export default function SearchText() {
  const onSearch = useCallback(() => {
    const searchText =
      (document.getElementById("searchText") as HTMLInputElement)?.value || "";

    if (!searchText) return;
    window.location.href = `/search/${searchText}`;
  }, []);

  return (
    <div
      className="align-center text-white bg-cumground"
      style={{
        padding: "10px",
        borderRadius: "10px",
        width: "940px",
        height: "50px",
        marginTop: "13px",
      }}
    >
      <div className="flex flex-row ">
        <h1 className="mr-2 font-bold">
          Continue Searching For Other Opponents! :
        </h1>
        <input
          className="bg-white rounded-sm w-128 h-6 text-black focus:outline-orange-500 focus:outline-2"
          id="searchText"
          type="text"
          onFocus={(e) => { (e.target as HTMLInputElement).value = ""; }}
        />
        <div
          className="ml-2 -mt-1 cursor-pointer transition ease-in hover:drop-shadow-[0_1px_1px_rgba(255,_85,_0,_1)]"
          id="searchIcon"
          onClick={onSearch}
        >
          <svg
            enableBackground="new 0 0 50 50"
            height="34px"
            id="SearchIcon"
            viewBox="0 0 50 50"
            width="34px"
          >
            <rect fill="none" height="50" width="50" />
            <circle
              cx="21"
              cy="20"
              fill="none"
              r="15"
              stroke="#fff"
              strokeWidth={5}
            />
            <line
              fill="none"
              stroke="#fff"
              strokeWidth={5}
              x1="32.229"
              x2="49.9"
              y1="32.229"
              y2="49.9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
