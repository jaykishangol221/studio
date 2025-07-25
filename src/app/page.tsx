import ChronoAssist from "@/components/chrono-assist";
import { BookOpenText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-md">
            <BookOpenText className="h-10 w-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary tracking-tight">
            ChronoAIssist
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            Your AI-powered chronicle search assistant. Uncover historical summaries and pinpoint specific dates with ease.
          </p>
        </header>
        <main>
          <ChronoAssist />
        </main>
        <footer className="text-center mt-12 text-sm text-muted-foreground">
            <p>Powered by Google's Gemini.</p>
        </footer>
      </div>
    </div>
  );
}

    