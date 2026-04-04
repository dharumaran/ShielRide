import { Badge } from "@/components/ui/badge";

export function GuidewireSync({ className }: { className?: string }) {
  return (
    <Badge variant="success" className={className}>
      GW ✓
    </Badge>
  );
}
