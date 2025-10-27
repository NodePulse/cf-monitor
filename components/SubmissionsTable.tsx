import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Submission } from "../types";
import { DataTable } from "./DataTable";

interface SubmissionsTableProps {
  submissions: Submission[];
}

const verdictStyle = (v?: string): string => {
  if (v === "OK") return "text-green-400 font-bold";
  if (v === "WRONG_ANSWER") return "text-red-400 font-semibold";
  if (v === "TIME_LIMIT_EXCEEDED") return "text-purple-400 font-semibold";
  if (v === "COMPILATION_ERROR") return "text-yellow-400 font-semibold";
  if (v === "RUNTIME_ERROR") return "text-orange-400 font-semibold";
  return "text-slate-400";
};

// Rating colors
const getRatingColor = (rating?: number): string => {
  if (rating === undefined || rating === null) return "text-slate-400";
  if (rating >= 3000) return "text-red-500 font-extrabold";
  if (rating >= 2600) return "text-red-500 font-bold";
  if (rating >= 2400) return "text-red-400 font-bold";
  if (rating >= 2100) return "text-yellow-400 font-bold";
  if (rating >= 1900) return "text-purple-400 font-bold";
  if (rating >= 1600) return "text-blue-400 font-bold";
  if (rating >= 1400) return "text-cyan-400 font-bold";
  if (rating >= 1200) return "text-green-400 font-bold";
  return "text-slate-400 font-bold";
};

const TABLE_HEADERS = ["ID", "Problem", "Rating", "Language", "Verdict", "Time"];

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
}) => {
  return (
    <DataTable
      headers={TABLE_HEADERS}
      data={submissions}
      renderRow={(s: Submission) => (
        <TableRow key={s.id} className="border-b-0">
          <TableCell className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            <a
              href={`https://codeforces.com/contest/${s.contestId}/submission/${s.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.id}
            </a>
          </TableCell>
          <TableCell className="text-slate-800 dark:text-slate-200">
            <a
              href={`https://codeforces.com/contest/${s.contestId}/problem/${s.problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {s.problem.name}
            </a>
          </TableCell>
          <TableCell className={getRatingColor(s.problem.rating)}>
            {s.problem.rating ?? "N/A"}
          </TableCell>
          <TableCell className="text-slate-600 dark:text-slate-400">
            {s.programmingLanguage}
          </TableCell>
          <TableCell className={verdictStyle(s.verdict)}>
            {s.verdict ?? "N/A"}
          </TableCell>
          <TableCell className="text-slate-500 dark:text-slate-400">
            {new Date(s.creationTimeSeconds * 1000).toLocaleString()}
          </TableCell>
        </TableRow>
      )}
      emptyState={
        <td colSpan={TABLE_HEADERS.length} className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-medium">No submissions found for selected filters.</td>
      }
    />
  );
};
