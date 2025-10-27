// app/calender/CalendarView.tsx
"use client";

import { useState, FC } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";

type SolvedProblem = {
  id: number;
  rating: number;
};

interface CalendarViewProps {
  submissionsByDate: Record<string, SolvedProblem[]>;
}

const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
      {format(currentMonth, "MMMM yyyy")}
    </h2>
    <div className="flex items-center gap-2">
      <button
        onClick={onPrevMonth}
        className="px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
      >
        &lt;
      </button>
      <button
        onClick={onToday}
        className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Today
      </button>
      <button
        onClick={onNextMonth}
        className="px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
      >
        &gt;
      </button>
    </div>
  </div>
);

const CalendarDays = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="grid grid-cols-7 text-center font-medium text-gray-600">
      {days.map((day) => (
        <div key={day} className="py-2">
          {day}
        </div>
      ))}
    </div>
  );
};

// Helper to get color based on rating
const getRatingPillStyle = (rating: number): string => {
  if (rating >= 2400)
    return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
  if (rating >= 2100)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
  if (rating >= 1900)
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
  if (rating >= 1600)
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  if (rating >= 1400)
    return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300";
  if (rating >= 1200)
    return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
};

const RatingPill: FC<{ rating: number }> = ({ rating }) => (
  <div
    className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${getRatingPillStyle(
      rating
    )}`}
  >
    {rating}
  </div>
);

const CalendarGrid = ({
  currentMonth,
  submissionsByDate,
}: {
  currentMonth: Date;
  submissionsByDate: Record<string, SolvedProblem[]>;
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 border-l border-t border-slate-200 dark:border-slate-800">
      {days.map((day) => {
        const isCurrentMonth = isSameMonth(day, monthStart);
        const solvedProblems = submissionsByDate[day.toDateString()] || [];
        const hasSubmissions = solvedProblems.length > 0;
        const isCurrentDay = isToday(day);

        // Group problems by rating
        const ratingCounts: Record<number, number> = {};
        solvedProblems.forEach((p) => {
          ratingCounts[p.rating] = (ratingCounts[p.rating] || 0) + 1;
        });

        // Sort ratings ascending for neat display
        const sortedRatings = Object.keys(ratingCounts)
          .map(Number)
          .sort((a, b) => a - b);

        return (
          <div
            key={day.toString()}
            className={`
              h-32 border-r border-b border-slate-200 dark:border-slate-800 p-2 flex flex-col justify-between overflow-hidden transition-colors duration-150
              ${
                isCurrentMonth
                  ? "bg-white dark:bg-slate-900"
                  : "bg-slate-50 dark:bg-slate-900/50 text-slate-400"
              }
              ${hasSubmissions ? "bg-green-50 dark:bg-green-900/20" : ""}
            `}
          >
            {/* Date Number */}
            <span
              className={`
                flex items-center justify-center h-8 w-8 rounded-full
                ${
                  isCurrentDay
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-600 dark:text-slate-300"
                }
              `}
            >
              {format(day, "d")}
            </span>

            {/* Rating → Count Display */}
            {hasSubmissions && isCurrentMonth && (
              <div className="mt-1 space-y-0.5 overflow-y-auto">
                {sortedRatings.map((rating) => (
                  <div
                    key={rating}
                    className={`text-[11px] px-2 py-0.5 rounded-md flex justify-between ${getRatingPillStyle(
                      rating
                    )}`}
                  >
                    <span>{rating}</span>
                    <span className="font-semibold">
                      {ratingCounts[rating]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function CalendarView({ submissionsByDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={goToToday}
      />
      <CalendarDays />
      <CalendarGrid
        currentMonth={currentMonth}
        submissionsByDate={submissionsByDate}
      />
    </div>
  );
}
