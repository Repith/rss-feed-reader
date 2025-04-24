import clsx from "clsx";
import { useTheme } from "./ThemeProvider";
import { Icons } from "../lib/styles/icons/Icon";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "p-2 rounded-full cursor-pointer",
        theme === "light"
          ? "text-purple-800 hover:bg-purple-100"
          : "text-purple-200 hover:bg-purple-800/30",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2",
        theme === "light"
          ? "focus:ring-purple-500/50"
          : "focus:ring-purple-400/50"
      )}
      aria-label={`Switch to ${
        theme === "light" ? "dark" : "light"
      } mode`}
    >
      <Icons
        name={theme === "dark" ? "moon" : "sun"}
        className="w-5 h-5"
      />
    </button>
  );
}
