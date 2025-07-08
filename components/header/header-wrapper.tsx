import { HeaderLogo } from "./header-logo";
import { ThemeToggle } from "../theme-toggle";

// Wrapper for header componenets
export function HeaderWrapper() {
  return (
    <div className="w-full bg-black py-8">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center">
          <HeaderLogo />
        </div>
        <div className="text-white">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
