interface NewQuizProps {
  children?: React.ReactNode;
}

export default function NewQuizLayout({ children }: NewQuizProps) {
  return (
    <div className="container mx-auto grid items-center gap-10 py-8">
      {children}
    </div>
  );
}
