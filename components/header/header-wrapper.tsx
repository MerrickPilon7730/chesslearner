"use client";

import { HeaderLogo } from "./header-logo";
import { Navbar } from "./navbar/navbar";

// Wrapper for header componenets
export function HeaderWrapper() {
  return (
    <div className="w-full dark:bg-black bg-blue-700 py-7">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center gap-x-10">
          <HeaderLogo />
          <Navbar />
        </div>
      </div>
    </div>
  );
}
