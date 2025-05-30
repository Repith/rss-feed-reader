import clsx from "clsx";
import { IconsDetailsProps } from "./Icon";

export function DoorArrowLeft({
  className,
}: IconsDetailsProps) {
  return (
    <svg
      className={clsx(className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M6.25 2A2.25 2.25 0 0 0 4 4.25v15.5A2.25 2.25 0 0 0 6.25 22h6.56a6.518 6.518 0 0 1-1.078-1.5H6.25a.75.75 0 0 1-.75-.75V4.25a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v6.826c.523.081 1.026.224 1.5.422V4.25A2.25 2.25 0 0 0 17.75 2H6.25ZM17.5 23a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm3.5-5.5a.5.5 0 0 1-.5.5h-4.793l1.647 1.646a.5.5 0 0 1-.708.708l-2.5-2.5a.5.5 0 0 1 0-.708l2.5-2.5a.5.5 0 0 1 .708.708L15.707 17H20.5a.5.5 0 0 1 .5.5ZM8.5 13.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}
