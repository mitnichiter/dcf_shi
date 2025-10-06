import ReportForm from '@/components/ReportForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">Carmel PDF Generator</h1>
      </div>
      <div className="mt-10 w-full max-w-lg">
        <ReportForm />
      </div>
    </main>
  );
}