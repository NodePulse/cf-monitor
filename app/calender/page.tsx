// app/calender/page.tsx

import CalendarView from './CalendarView';
import { Suspense } from 'react';

const DEFAULT_USER_HANDLE = 'sachin_bh123'; // Fallback handle

type Submission = {
  id: number;
  creationTimeSeconds: number;
  verdict?: string;
  problem: {
    rating?: number;
    [key: string]: any;
  };
};

async function getSubmissions(handle: string): Promise<Submission[]> {
  try {
    const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`);
    if (!res.ok) throw new Error(`API request failed: ${res.status}`);
    const data = await res.json();
    if (data.status !== 'OK') throw new Error(`API error: ${data.comment}`);
    return data.result;
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return [];
  }
}

async function CalendarData({ handle }: { handle: string }) {
  const submissions: Submission[] = await getSubmissions(handle);

  // Group submissions by date
  const submissionsByDate = submissions.reduce((acc, sub) => {
    const date = new Date(sub.creationTimeSeconds * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    if (sub.verdict === 'OK' && sub.problem.rating) {
      acc[date].push({
        id: sub.id,
        rating: sub.problem.rating,
      });
    }
    return acc;
  }, {} as Record<string, { id: number; rating: number }[]>);

  return <CalendarView submissionsByDate={submissionsByDate} />;
}

export default function CalendarPage({ searchParams }: { searchParams: { handle?: string } }) {
  const handle = searchParams.handle || DEFAULT_USER_HANDLE;
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Submission Calendar</h1>
      <p className="text-lg text-gray-500 mb-6">
        Analysis for <span className="font-semibold text-blue-600">{handle}</span>
      </p>
      <Suspense fallback={<div className="bg-white p-6 rounded-lg shadow-md text-center">Loading Calendar...</div>}>
        <CalendarData handle={handle} />
      </Suspense>
    </>
  );
}