import { Badge } from "@/components/ui/badge";

const statusStyles = {
  Green: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
  Yellow: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30",
  Red: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30"
};

export function StatusBadge({ status }: { status: "Green" | "Yellow" | "Red" }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
