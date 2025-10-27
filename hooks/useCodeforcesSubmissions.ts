import { useState, useEffect, useMemo } from "react";
import { CodeforcesResponse, Submission } from "../types";

export const useCodeforcesSubmissions = (handle: string, count: number) => {
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=${count}`
      );
      const data: CodeforcesResponse<Submission[]> = await res.json();
      if (data.status !== "OK") throw new Error(data.comment || "Fetch failed");
      setAllSubmissions(data.result);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching submissions.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [handle, count]);

  const uniqueVerdicts = useMemo(() => 
    ["ALL", ...Array.from(new Set(allSubmissions.map(s => s.verdict).filter(Boolean))) as string[]],
    [allSubmissions]
  );

  const uniqueLanguages = useMemo(() =>
    ["ALL", ...Array.from(new Set(allSubmissions.map(s => s.programmingLanguage).filter(Boolean)))],
    [allSubmissions]
  );

  const uniqueRatings = useMemo(() => {
    const ratings = Array.from(new Set(allSubmissions.map(s => s.problem.rating).filter(Boolean) as number[]));
    ratings.sort((a, b) => a - b);
    return ["ALL", ...ratings.map(String)];
  }, [allSubmissions]);


  return { allSubmissions, loading, error, fetchSubmissions, uniqueVerdicts, uniqueLanguages, uniqueRatings };
};