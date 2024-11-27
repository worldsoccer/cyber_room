interface GameQuizProps {
  children?: React.ReactNode;
}

export default function GameQuizLayout({ children }: GameQuizProps) {
  return (
    <div className="container mx-auto grid items-center gap-10 py-8">
      {children}
    </div>
  );
}
