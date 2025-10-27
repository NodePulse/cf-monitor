"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCodeforcesSubmissions } from "@/hooks/useCodeforcesSubmissions";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { TableCell, TableRow } from "@/components/ui/table";
import { format, parseISO, getWeek, getYear } from "date-fns";

// 🎯 Define points based on rating
const getPointsForRating = (rating: number): number => {
  if (rating >= 2400) return 25;
  if (rating >= 2300) return 22;
  if (rating >= 2200) return 20;
  if (rating >= 2100) return 18;
  if (rating >= 2000) return 16;
  if (rating >= 1900) return 14;
  if (rating >= 1800) return 12;
  if (rating >= 1700) return 11;
  if (rating >= 1600) return 10;
  if (rating >= 1500) return 9;
  if (rating >= 1400) return 8;
  if (rating >= 1300) return 7;
  if (rating >= 1200) return 6;
  if (rating >= 1100) return 5;
  if (rating >= 1000) return 4;
  if (rating >= 900) return 3;
  if (rating >= 800) return 2;
  return 1;
};

export default function PointsSystemPage() {
  const handle = "sachin_bh123";
  const { allSubmissions, loading, error, fetchSubmissions } =
    useCodeforcesSubmissions(handle, 1000);

  const [dailyPage, setDailyPage] = useState(1);
  const [weeklyPage, setWeeklyPage] = useState(1);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [yearlyPage, setYearlyPage] = useState(1);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ✅ Filter accepted submissions only
  const acceptedSubs = useMemo(
    () => allSubmissions.filter((s) => s.verdict === "OK"),
    [allSubmissions]
  );

  // 🧮 Memoized point calculations for different time frames
  const {
    pointsByDate,
    pointsByWeek,
    pointsByMonth,
    pointsByYear,
    submissionsByDate,
  } = useMemo(() => {
    const subsByDate: Record<string, any[]> = {};
    const ptsByDate: Record<string, number> = {};
    const ptsByWeek: Record<string, number> = {};
    const ptsByMonth: Record<string, number> = {};
    const ptsByYear: Record<string, number> = {};

    acceptedSubs.forEach((sub) => {
      const date = new Date(sub.creationTimeSeconds * 1000);
      const points = getPointsForRating(sub.problem.rating || 0);

      // Daily
      const dateKey = format(date, "yyyy-MM-dd");
      if (!subsByDate[dateKey]) subsByDate[dateKey] = [];
      subsByDate[dateKey].push(sub);
      ptsByDate[dateKey] = (ptsByDate[dateKey] || 0) + points;

      // Weekly
      const weekKey = `${getYear(date)}-${getWeek(date, { weekStartsOn: 1 })}`;
      ptsByWeek[weekKey] = (ptsByWeek[weekKey] || 0) + points;

      // Monthly
      const monthKey = format(date, "yyyy-MM");
      ptsByMonth[monthKey] = (ptsByMonth[monthKey] || 0) + points;

      // Yearly
      const yearKey = format(date, "yyyy");
      ptsByYear[yearKey] = (ptsByYear[yearKey] || 0) + points;
    });

    return {
      pointsByDate: ptsByDate,
      pointsByWeek: ptsByWeek,
      pointsByMonth: ptsByMonth,
      pointsByYear: ptsByYear,
      submissionsByDate: subsByDate,
    };
  }, [acceptedSubs]);

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayPoints = pointsByDate[todayKey] || 0;
  const totalPoints = Object.values(pointsByDate).reduce((a, b) => a + b, 0);
  
  const sortedDaily = useMemo(() => {
    const currentMonthKey = format(new Date(), "yyyy-MM");
    return Object.keys(pointsByDate)
      .filter((date) => date.startsWith(currentMonthKey))
      .sort((a, b) => (a > b ? -1 : 1));
  }, [pointsByDate]);
  const sortedWeekly = Object.keys(pointsByWeek).sort((a, b) =>
    a > b ? -1 : 1
  );
  const sortedMonthly = Object.keys(pointsByMonth).sort((a, b) =>
    a > b ? -1 : 1
  );
  const sortedYearly = Object.keys(pointsByYear).sort((a, b) =>
    a > b ? -1 : 1
  );

  const selectedSubmissions = selectedDate
    ? submissionsByDate[selectedDate] || []
    : [];

  if (loading) return <LoadingScreen message="Calculating your progress..." />;

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
    <div className="space-y-8 p-6 animate-fade-in">
      {/* 🌟 Overview Card */}
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-wide">
            Points Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6 text-center justify-around">
          <div>
            <p className="text-sm opacity-80">Today’s Points</p>
            <p className="text-3xl font-bold">{todayPoints}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Total Points</p>
            <p className="text-3xl font-bold">{totalPoints}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Solved Days</p>
            <p className="text-3xl font-bold">{sortedDaily.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* 📅 Daily Breakdown Table */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>

            <PaginatedTable
              title="Daily Breakdown"
              headers={["Date", "Points", "Actions"]}
              data={sortedDaily}
              paginate={false}
              renderRow={(date: string) => (
                <TableRow
                  key={date}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <TableCell>
                    {format(parseISO(date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>{pointsByDate[date]}</TableCell>
                  <TableCell className="py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(date)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            />
            <PaginatedTable
              title="Weekly Breakdown"
              headers={["Week", "Points"]}
              data={sortedWeekly}
              page={weeklyPage}
              setPage={setWeeklyPage} // This will be handled by Pagination now
              renderRow={(week: string) => (
                <TableRow
                  key={week}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <TableCell>{week.replace("-", " - Week ")}</TableCell>
                  <TableCell>{pointsByWeek[week]}</TableCell>
                </TableRow>
              )}
            />
            <PaginatedTable
              title="Monthly Breakdown"
              headers={["Month", "Points"]}
              data={sortedMonthly}
              page={monthlyPage}
              setPage={setMonthlyPage} // This will be handled by Pagination now
              renderRow={(month: string) => (
                <TableRow
                  key={month}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <TableCell>
                    {format(parseISO(month), "MMM yyyy")}
                  </TableCell>
                  <TableCell>{pointsByMonth[month]}</TableCell>
                </TableRow>
              )}
            />
            <PaginatedTable
              title="Yearly Breakdown"
              headers={["Year", "Points"]}
              data={sortedYearly}
              page={yearlyPage}
              setPage={setYearlyPage} // This will be handled by Pagination now
              renderRow={(year: string) => (
                <TableRow
                  key={year}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <TableCell>{year}</TableCell>
                  <TableCell>{pointsByYear[year]}</TableCell>
                </TableRow>
              )}
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* 🧾 Dialog for Daily Details */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-lg bg-white dark:bg-slate-900 rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `Summary — ${format(parseISO(selectedDate), "dd MMM yyyy")}`
                : "Day Summary"}
            </DialogTitle>
            <DialogDescription>
              Breakdown of problems solved and their respective points.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Total Points:{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {selectedDate ? pointsByDate[selectedDate] : 0}
              </span>
            </p>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 px-2 text-left">Problem</th>
                  <th className="py-2 px-2 text-left">Rating</th>
                  <th className="py-2 px-2 text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                {selectedSubmissions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-200 dark:border-slate-800"
                  >
                    <td className="py-1 px-2 truncate max-w-[200px]">
                      {s.problem.name}
                    </td>
                    <td className="py-1 px-2">{s.problem.rating || "–"}</td>
                    <td className="py-1 px-2 font-semibold text-indigo-600 dark:text-indigo-400">
                      {getPointsForRating(s.problem.rating || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedSubmissions.length === 0 && (
              <p className="text-center text-slate-400 py-4">
                No submissions this day.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ROWS_PER_PAGE = 10;

interface PaginatedTableProps {
  title: string;
  headers: string[];
  data: string[];
  renderRow: (item: string) => React.ReactNode;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  paginate?: boolean;
}

function PaginatedTable({
  title,
  headers,
  data,
  page,
  setPage,
  renderRow,
  paginate = true,
}: PaginatedTableProps) {
  const totalPages = paginate ? Math.ceil(data.length / ROWS_PER_PAGE) : 1;
  const paginatedData =
    paginate && page
      ? data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)
      : data;

  return (
    <TabsContent value={title.split(" ")[0].toLowerCase()}>
      <div className="mt-4">
        <DataTable
          headers={headers}
          data={paginatedData as any[]}
          renderRow={renderRow}
          emptyState={<td colSpan={headers.length}>No data</td>}
        />
        {paginate && page && setPage && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="flex items-center justify-end space-x-2 py-4"
          />
        )}
      </div>
    </TabsContent>
  );
}
