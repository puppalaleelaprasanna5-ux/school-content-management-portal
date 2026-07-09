import Card from "../../components/ui/Card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="!rounded-xl !p-6 sm:!p-8">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-slate-600">{description}</p>
      </Card>
    </div>
  );
}
