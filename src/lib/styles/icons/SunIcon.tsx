import clsx from "clsx";
import { IconsDetailsProps } from "./Icon";

export function SunIcon({ className }: IconsDetailsProps) {
  return (
    <svg
      className={clsx(className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      height={24}
      width={24}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
