"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCodeforcesSubmissions } from "@/hooks/useCodeforcesSubmissions";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SubmissionFilters } from "@/components/SubmissionFilters";
import { Pagination } from "@/components/Pagination";
import { SubmissionsTable } from "@/components/SubmissionsTable";

const SubmissionsPage: React.FC = () => {
  const handle = "sachin_bh123";
  const submissionCount = 100;
  const itemsPerPage = 15;

  const {
    allSubmissions,
    loading,
    error,
    uniqueVerdicts,
    uniqueLanguages,
    uniqueRatings,
    fetchSubmissions,
  } = useCodeforcesSubmissions(handle, submissionCount);

  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [languageFilter, setLanguageFilter] = useState("ALL");
  const [problemNameFilter, setProblemNameFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [
    verdictFilter,
    languageFilter,
    problemNameFilter,
    ratingFilter,
  ]);

  const filteredSubmissions = useMemo(
    () =>
      allSubmissions
        .filter((s) => verdictFilter === "ALL" || s.verdict === verdictFilter)
        .filter(
          (s) =>
            languageFilter === "ALL" ||
            s.programmingLanguage === languageFilter
        )
        .filter((s) =>
          s.problem.name
            .toLowerCase()
            .includes(problemNameFilter.toLowerCase())
        )
        .filter(
          (s) =>
            ratingFilter === "ALL" || String(s.problem.rating) === ratingFilter
        ),
    [
      allSubmissions,
      verdictFilter,
      languageFilter,
      problemNameFilter,
      ratingFilter,
    ]
  );

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingScreen message="Fetching submissions..." />;

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-950 via-red-900 to-red-800 text-red-200 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">⚠️ Error Loading Data</h2>
        <p className="mb-4 text-center">{error}</p>
        <Button
          onClick={fetchSubmissions}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Try Again
        </Button>
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Codeforces Submissions —{" "}
          <span className="text-indigo-500">{handle}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Track your problem-solving journey with filters, stats, and insights.
        </p>
      </div>

      {/* Submissions Section */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl transition-all">
        <CardContent className="p-4 sm:p-6 space-y-6">
          <SubmissionFilters
            uniqueLanguages={uniqueLanguages}
            problemNameFilter={problemNameFilter}
            setProblemNameFilter={setProblemNameFilter}
            verdictFilter={verdictFilter}
            setVerdictFilter={setVerdictFilter}
            uniqueVerdicts={uniqueVerdicts}
            languageFilter={languageFilter}
            setLanguageFilter={setLanguageFilter}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            uniqueRatings={uniqueRatings}
          />

          <SubmissionsTable submissions={paginatedSubmissions} />
        </CardContent>

        <CardFooter className="border-t border-slate-200 dark:border-slate-800 p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 w-full"
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmissionsPage;
