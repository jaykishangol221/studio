'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CalendarClock, BookText, AlertTriangle } from 'lucide-react';

import { identifyHistoricalDate } from '@/ai/flows/identify-historical-date';
import { summarizeHistoricalInfo } from '@/ai/flows/summarize-historical-info';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  keywords: z.string().min(3, {
    message: 'Please enter at least 3 characters.',
  }),
});

type SearchMode = 'summary' | 'date';

interface Result {
  summary?: string;
  date?: string;
  dateSummary?: string;
}

export default function ChronoAssist() {
  const [searchMode, setSearchMode] = useState<SearchMode>('summary');
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      if (searchMode === 'summary') {
        const response = await summarizeHistoricalInfo({
          keywords: values.keywords,
        });
        setResult({ summary: response.summary });
      } else {
        const response = await identifyHistoricalDate({
          keywords: values.keywords,
        });
        setResult({ date: response.date, dateSummary: response.summary });
      }
    } catch (e) {
      setError('An error occurred while fetching information. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Start Your Search</CardTitle>
          <CardDescription>
            Select a search mode and enter your keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="summary"
            className="w-full mb-6"
            onValueChange={(value) => setSearchMode(value as SearchMode)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="date">Date</TabsTrigger>
            </TabsList>
          </Tabs>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          searchMode === 'summary'
                            ? 'e.g., "The Renaissance"'
                            : 'e.g., "First moon landing"'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Get Information'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50">
          {result.summary && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookText className="text-primary" />
                  Historical Summary
                </CardTitle>
                <CardDescription>
                  A concise overview based on your keywords.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">
                  {result.summary}
                </p>
              </CardContent>
            </>
          )}
          {result.date && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="text-primary" />
                  Identified Date
                </CardTitle>
                <CardDescription>
                  The most relevant date found for your keywords.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-bold text-primary">{result.date}</p>
                {result.dateSummary && (
                  <div>
                    <h4 className="font-semibold mb-2">Event Summary</h4>
                    <p className="text-foreground/90 leading-relaxed">
                      {result.dateSummary}
                    </p>
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
