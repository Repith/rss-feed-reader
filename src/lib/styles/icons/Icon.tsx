import { AvailabilityIcon } from "./AvailabilityIcon";
import { BugIcon } from "./BugIcon";
import { CloseIcon } from "./CloseIcon";
import { BrainCircuitIcon } from "./BrainCircuitIcon";
import { MenuIcon } from "./MenuIcon";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";
import { SystemIcon } from "./SystemIcon";
import { TimeIcon } from "./TimeIcon";
import { LoadingIcon } from "./LoadingIcon";
import { EmptyIcon } from "./EmptyIcon";
import { CodeIcon } from "./CodeIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { ChevronUpIcon } from "./ChevronUpIcon";
import { DoorArrowLeft } from "./DoorArrowLeft";
import { SearchIcon } from "./SearchIcon";
import { FilterIcon } from "./FilterIcon";

const iconComponents = {
  sun: SunIcon,
  moon: MoonIcon,
  system: SystemIcon,
  menu: MenuIcon,
  close: CloseIcon,
  time: TimeIcon,
  bug: BugIcon,
  availability: AvailabilityIcon,
  brainCircuit: BrainCircuitIcon,
  loading: LoadingIcon,
  empty: EmptyIcon,
  code: CodeIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  doorArrowLeft: DoorArrowLeft,
  search: SearchIcon,
  filter: FilterIcon,
} as const;

export type IconName = keyof typeof iconComponents;

interface IconsProps {
  name: IconName;
  className?: string;
}

export function Icons({ name, className }: IconsProps) {
  const IconComponent = iconComponents[name];
  return <IconComponent className={className} />;
}

export interface IconsDetailsProps {
  className?: string;
}
