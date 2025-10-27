// app/stats/page.tsx

import StatsView from './StatsView';
import { Submission } from '@/types';
import { Suspense } from 'react';

const DEFAULT_USER_HANDLE = 'sachin_bh123'; // Fallback handle
 
async function getSubmissions(handle: string): Promise<Submission[]> {
  try {
    const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`);
    if (!res.ok) {
      throw new Error(`Failed to fetch data from Codeforces API. Status: ${res.status}`);
    }
    const data = await res.json();
    if (data.status !== 'OK') {
      throw new Error(`Codeforces API error: ${data.comment}`);
    }
    // The API returns submissions in descending order of time.
    // Reversing them makes chronological processing easier.
    return data.result.reverse();
  } catch (error) {
    console.error(error);
    // Return an empty array on error to prevent the page from crashing.
    // You could also render a dedicated error component here.
    return [];
  }
}

async function StatsData({ handle }: { handle: string }) {
  const submissions: Submission[] = await getSubmissions(handle);

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Submission Stats</h1>
      <p className="text-lg text-gray-500 mb-6">
        Analysis for <span className="font-semibold text-blue-600">{handle}</span>
      </p>
      <StatsView submissions={submissions} />
    </>
  );
}

export default function StatsPage({ searchParams }: { searchParams: { handle?: string } }) {
  const handle = searchParams.handle || DEFAULT_USER_HANDLE;

  return (
    <>
      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsData handle={handle} />
      </Suspense>
    </>
  );
}