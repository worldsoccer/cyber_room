import { cn } from "@/lib/utils";

interface GameQuizShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function GameQuizShell({
  children,
  className,
  ...props
}: GameQuizShellProps) {
  return (
    <div className={cn("grid items-center gap-8", className)} {...props}>
      {children}
    </div>
  );
}
