interface EditQuizProps {
  children?: React.ReactNode;
}

export default function EditQuizLayout({ children }: EditQuizProps) {
  return (
    <div className="container mx-auto grid items-center gap-10 py-8">
      {children}
    </div>
  );
}
