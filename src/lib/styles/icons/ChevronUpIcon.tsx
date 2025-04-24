import clsx from "clsx";
import { IconsDetailsProps } from "./Icon";

export function ChevronUpIcon({
  className,
}: IconsDetailsProps) {
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
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}
