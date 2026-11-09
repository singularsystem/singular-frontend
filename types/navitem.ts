import { LucideIcon } from "lucide-react";

export interface NavChild {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
  children?: NavChild[];
}
