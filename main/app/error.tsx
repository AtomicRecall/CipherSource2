"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service

    console.error("OG MFSDJKFSD ",error);
  }, [error]);

  return (
    <div>
      <h2> Something went wrong!</h2>
      ({error.message}) from {error.stack?.substring(0,error.stack.indexOf("@"))}. Open up the console (F12) for more information.
      <div> Send what you see here and in console to: atomic#5689 on discord and he will most likely fix that shit.</div>
      
      <div> </div>
    </div>
  );
}
