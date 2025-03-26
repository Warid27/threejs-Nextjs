"use client"; // Ensures Game runs in the client environment

import Link from "next/link";
import SimpleCube from "@/components/SimpleCube";

const Game = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      {/* Back Button */}
      <Link
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        href={"/"}
      >
        Back
      </Link>

      {/* Three.js Cube */}
      <SimpleCube />
    </div>
  );
};

export default Game;
