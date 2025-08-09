interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          This page is coming soon! Continue prompting to help us build out this
          section.
        </p>
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-4xl text-muted-foreground">🚧</span>
        </div>
      </div>
    </div>
  );
}
