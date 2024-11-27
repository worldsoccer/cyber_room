interface GameTestProps {
  children?: React.ReactNode;
}

export default function GameTestLayout({ children }: GameTestProps) {
  return (
    <div className="container mx-auto grid items-center gap-10 py-8">
      {children}
    </div>
  );
}
