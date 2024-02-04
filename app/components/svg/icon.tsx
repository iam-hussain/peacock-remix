import Team from "./icon/team";
import AddBox from "./icon/add-box";
import Shop from "./icon/shop";
import Dashboard from "./icon/dashboard";
import Archive from "./icon/archive";
import Settings from "./icon/settings";
import Transaction from "./icon/transaction";
import Close from "./icon/close";
import Home from "./icon/home";
import Group from "./icon/group";
import Member from "./icon/member";
import Trans from "./icon/trans";
import Edit from "./icon/edit";
import Delete from "./icon/delete";
import Deleted from "./icon/deleted";
import Screenshot from "./icon/screenshot";
import Active from "./icon/active";

export const Icons = {
  "add-box": AddBox,
  team: Team,
  shop: Shop,
  dash: Dashboard,
  archive: Archive,
  setting: Settings,
  transaction: Transaction,
  close: Close,
  home: Home,
  group: Group,
  member: Member,
  trans: Trans,
  edit: Edit,
  delete: Delete,
  deleted: Deleted,
  screenshot: Screenshot,
  active: Active,
};

interface IconProps {
  name?: keyof typeof Icons;
  color?: "white" | "black" | "primary" | "slate" | "slateStroke";
  className?: string;
}

const colorObject = {
  white: "stroke-white fill-white",
  black: "stroke-black fill-black",
  slate: "stroke-slate-500 fill-slate-500",
  slateStroke: "stroke-slate-500 hover:stroke-primary-500",
  // slate-stroke: "stroke-slate-500",
  primary: "stroke-primary-400 fill-primary-400",
};

function Icon({ name, color, className }: IconProps) {
  const Default = Icons.team;
  let iconClasses = `${color ? colorObject[color] : ""} ${className || ""}`;

  if (name && Icons[name]) {
    const Comp = Icons[name];
    return <Comp className={iconClasses} />;
  }
  return <Default className={iconClasses} />;
}

export default Icon;
