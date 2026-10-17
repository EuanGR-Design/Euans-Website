import {
  AdjustmentsVerticalIcon,
  ArrowLongRightIcon,
  ArrowTrendingDownIcon,
  ArrowUturnLeftIcon,
  BeakerIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  FlagIcon,
  LinkSlashIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  NumberedListIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PuzzlePieceIcon,
  QueueListIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
  VideoCameraIcon,
  ViewColumnsIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";

// Heroicons (outline) that content can ask for by name, without the "Icon"
// suffix. Add one here to use it in projects.ts.
const icons = {
  AdjustmentsVertical: AdjustmentsVerticalIcon,
  ArrowLongRight: ArrowLongRightIcon,
  ArrowTrendingDown: ArrowTrendingDownIcon,
  ArrowUturnLeft: ArrowUturnLeftIcon,
  Beaker: BeakerIcon,
  Bolt: BoltIcon,
  ChatBubbleLeftRight: ChatBubbleLeftRightIcon,
  CursorArrowRays: CursorArrowRaysIcon,
  DocumentText: DocumentTextIcon,
  Flag: FlagIcon,
  LinkSlash: LinkSlashIcon,
  LockOpen: LockOpenIcon,
  MagnifyingGlass: MagnifyingGlassIcon,
  NumberedList: NumberedListIcon,
  PaperAirplane: PaperAirplaneIcon,
  PencilSquare: PencilSquareIcon,
  PuzzlePiece: PuzzlePieceIcon,
  QueueList: QueueListIcon,
  ShieldCheck: ShieldCheckIcon,
  Squares2X2: Squares2X2Icon,
  UserGroup: UserGroupIcon,
  Users: UsersIcon,
  VideoCamera: VideoCameraIcon,
  ViewColumns: ViewColumnsIcon,
  Window: WindowIcon,
};

export type IconName = keyof typeof icons;

export function Icon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  const Svg = icons[name];
  return <Svg aria-hidden className={className} />;
}

/** An icon on a soft accent tile, to lead a title. */
export function IconTile({ name, size = "md" }: { name: IconName; size?: "sm" | "md" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-accent-soft text-accent-ink ${
        size === "sm" ? "size-10 rounded-xl" : "size-12 rounded-2xl"
      }`}
    >
      <Icon name={name} className={size === "sm" ? "size-5" : "size-6"} />
    </span>
  );
}
