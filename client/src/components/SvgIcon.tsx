/**
 * SvgIcon — renders a self-hosted SVG icon from /icons/{name}.svg
 *
 * All icons are stored locally in client/public/icons/ and served from the
 * same origin. No external CDN or third-party icon service is used.
 *
 * Usage:
 *   <SvgIcon name="trophy" className="h-5 w-5 text-primary" />
 *
 * The `name` prop is the kebab-case filename without the .svg extension.
 * e.g. "arrow-left", "check-circle", "loader2", "bar-chart3"
 */

import { cn } from "@/lib/utils";
import React from "react";

export interface SvgIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** kebab-case icon name matching the filename in /icons/{name}.svg */
  name: string;
  /** Tailwind size class e.g. "h-5 w-5", or pixel number e.g. 24. Defaults to "h-4 w-4" */
  size?: string | number;
}

const SvgIcon = React.forwardRef<HTMLImageElement, SvgIconProps>(
  ({ name, size = "h-4 w-4", className, alt, ...props }, ref) => {
    const isNumeric = typeof size === "number";
    return (
      <img
        ref={ref}
        src={`/icons/${name}.svg`}
        alt={alt ?? name}
        aria-hidden={alt === "" ? true : undefined}
        width={isNumeric ? size : undefined}
        height={isNumeric ? size : undefined}
        className={cn(!isNumeric && size, "inline-block", className)}
        {...props}
      />
    );
  }
);

SvgIcon.displayName = "SvgIcon";

export default SvgIcon;

// ─── Named icon exports ────────────────────────────────────────────────────
// These match the lucide-react component names so imports are easy to swap.

const makeIcon = (iconName: string) =>
  React.forwardRef<HTMLImageElement, Omit<SvgIconProps, "name">>(
    (props, ref) => <SvgIcon ref={ref} name={iconName} {...props} />
  );

export const Activity = makeIcon("activity");
export const AlertCircle = makeIcon("alert-circle");
export const AlertTriangle = makeIcon("alert-triangle");
export const ArrowLeft = makeIcon("arrow-left");
export const ArrowRight = makeIcon("arrow-right");
export const BarChart3 = makeIcon("bar-chart3");
export const Brain = makeIcon("brain");
export const Check = makeIcon("check");
export const CheckCircle = makeIcon("check-circle");
export const CheckIcon = makeIcon("check");
export const ChevronDown = makeIcon("chevron-down");
export const ChevronDownIcon = makeIcon("chevron-down");
export const ChevronRight = makeIcon("chevron-right");
export const ChevronRightIcon = makeIcon("chevron-right");
export const ChevronUp = makeIcon("chevron-up");
export const ChevronUpIcon = makeIcon("chevron-up");
export const Circle = makeIcon("circle");
export const CircleIcon = makeIcon("circle");
export const Clock = makeIcon("clock");
export const Database = makeIcon("database");
export const DoorOpen = makeIcon("door-open");
export const Eye = makeIcon("eye");
export const Gamepad2 = makeIcon("gamepad2");
export const Globe = makeIcon("globe");
export const GripVertical = makeIcon("grip-vertical");
export const GripVerticalIcon = makeIcon("grip-vertical");
export const Heart = makeIcon("heart");
export const Home = makeIcon("home");
export const Info = makeIcon("info");
export const LayoutDashboard = makeIcon("layout-dashboard");
export const Loader2 = makeIcon("loader2");
export const Loader2Icon = makeIcon("loader2");
export const Lock = makeIcon("lock");
export const LogOut = makeIcon("log-out");
export const Mail = makeIcon("mail");
export const MapPin = makeIcon("map-pin");
export const Medal = makeIcon("medal");
export const MessageSquare = makeIcon("message-square");
export const Minus = makeIcon("minus");
export const MinusIcon = makeIcon("minus");
export const MoreHorizontal = makeIcon("more-horizontal");
export const PanelLeft = makeIcon("panel-left");
export const PanelLeftIcon = makeIcon("panel-left");
export const Phone = makeIcon("phone");
export const PlusCircle = makeIcon("plus-circle");
export const RotateCcw = makeIcon("rotate-ccw");
export const Search = makeIcon("search");
export const SearchIcon = makeIcon("search");
export const Send = makeIcon("send");
export const Settings = makeIcon("settings");
export const Shield = makeIcon("shield");
export const Sparkles = makeIcon("sparkles");
export const Star = makeIcon("star");
export const Target = makeIcon("target");
export const Trash2 = makeIcon("trash2");
export const Trophy = makeIcon("trophy");
export const User = makeIcon("user");
export const UserPlus = makeIcon("user-plus");
export const Users = makeIcon("users");
export const X = makeIcon("x");
export const XCircle = makeIcon("x-circle");
export const XIcon = makeIcon("x");
export const Zap = makeIcon("zap");
export const Menu = makeIcon("menu");
export const BookOpen = makeIcon("book-open");
export const CalendarIcon = makeIcon("calendar");
export const Calendar = makeIcon("calendar");
export const Moon = makeIcon("moon");
export const Sun = makeIcon("sun");
export const Copy = makeIcon("copy");
export const Play = makeIcon("play");
export const Crown = makeIcon("crown");
export const CheckCircle2 = makeIcon("check-circle2");

export const ChevronLeftIcon = makeIcon("chevron-left");
export const MoreHorizontalIcon = makeIcon("more-horizontal");
