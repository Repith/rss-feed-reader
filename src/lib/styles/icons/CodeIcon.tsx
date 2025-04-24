import clsx from "clsx";
import { IconsDetailsProps } from "./Icon";

export function CodeIcon({ className }: IconsDetailsProps) {
  return (
    <svg
      className={clsx(className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}
