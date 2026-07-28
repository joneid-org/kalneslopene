import {
  Calendar,
  Flag,
  type LucideIcon,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";

export const milestoneIcons: Record<string, LucideIcon> = {
  Flag,
  Users,
  Trophy,
  MapPin,
  Calendar,
};

export function getMilestoneIcon(icon: string): LucideIcon {
  return milestoneIcons[icon] ?? Flag;
}
