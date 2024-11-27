import { cn } from "@/lib/utils";

interface EditQuizShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function EditQuizShell({
  children,
  className,
  ...props
}: EditQuizShellProps) {
  return (
    <div className={cn("grid items-center gap-8", className)} {...props}>
      {children}
    </div>
  );
}
