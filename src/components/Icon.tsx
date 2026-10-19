import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArrowLongRightIcon,
  ArrowTrendingDownIcon,
  ArrowUturnLeftIcon,
  BeakerIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EyeIcon,
  FlagIcon,
  HandRaisedIcon,
  InboxStackIcon,
  ListBulletIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  NumberedListIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PlayIcon,
  PuzzlePieceIcon,
  QueueListIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
  VideoCameraIcon,
  ViewColumnsIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";

// Heroicons has no arrow that forks, so this one is drawn in its outline
// style: one arrow splitting two ways.
function ArrowsSplitIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12h5.25c2.5 0 3.5-6 6-6h7.5m0 0-3-3m3 3-3 3M7.5 12c2.5 0 3.5 6 6 6h7.5m0 0-3-3m3 3-3 3"
      />
    </svg>
  );
}

// Heroicons (outline) that content can ask for by name, without the "Icon"
// suffix. Add one here to use it in projects.ts.
const icons = {
  AdjustmentsHorizontal: AdjustmentsHorizontalIcon,
  ArrowLongRight: ArrowLongRightIcon,
  ArrowPath: ArrowPathIcon,
  ArrowsSplit: ArrowsSplitIcon,
  ArrowTrendingDown: ArrowTrendingDownIcon,
  ArrowUturnLeft: ArrowUturnLeftIcon,
  Beaker: BeakerIcon,
  Bolt: BoltIcon,
  ChatBubbleLeftRight: ChatBubbleLeftRightIcon,
  CursorArrowRays: CursorArrowRaysIcon,
  DocumentDuplicate: DocumentDuplicateIcon,
  DocumentText: DocumentTextIcon,
  Eye: EyeIcon,
  Flag: FlagIcon,
  HandRaised: HandRaisedIcon,
  InboxStack: InboxStackIcon,
  ListBullet: ListBulletIcon,
  LockOpen: LockOpenIcon,
  MagnifyingGlass: MagnifyingGlassIcon,
  NumberedList: NumberedListIcon,
  PaperAirplane: PaperAirplaneIcon,
  PencilSquare: PencilSquareIcon,
  Play: PlayIcon,
  PuzzlePiece: PuzzlePieceIcon,
  QueueList: QueueListIcon,
  ShieldCheck: ShieldCheckIcon,
  Squares2X2: Squares2X2Icon,
  UserGroup: UserGroupIcon,
  UserPlus: UserPlusIcon,
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
