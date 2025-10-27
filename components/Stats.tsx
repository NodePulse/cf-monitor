import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Submission } from "../types";

interface StatsProps {
  submissions: Submission[];
}

const StatCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => (
  <Card className={`text-center p-4 font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}>
    <div className="text-sm text-white/70">{title}</div>
    <div className="text-2xl">{value}</div>
  </Card>
);

export const Stats: React.FC<StatsProps> = ({ submissions }) => {
  const stats = useMemo(() => {
    const total = submissions.length;
    const accepted = submissions.filter(s => s.verdict === "OK").length;
    const wrong = submissions.filter(s => s.verdict === "WRONG_ANSWER").length;
    const tle = submissions.filter(s => s.verdict === "TIME_LIMIT_EXCEEDED").length;
    const acceptanceRate = total > 0 ? ((accepted / total) * 100).toFixed(1) + "%" : "N/A";

    return { total, accepted, wrong, tle, acceptanceRate };
  }, [submissions]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <StatCard title="Total Submissions" value={stats.total} className="bg-gradient-to-br from-blue-900 to-indigo-900 text-blue-100 border-blue-700" />
      <StatCard title="Accepted" value={stats.accepted} className="bg-gradient-to-br from-green-900 to-emerald-900 text-green-100 border-green-700" />
      <StatCard title="Acceptance Rate" value={stats.acceptanceRate} className="bg-gradient-to-br from-sky-900 to-cyan-900 text-sky-100 border-sky-700" />
      <StatCard title="Wrong Answer" value={stats.wrong} className="bg-gradient-to-br from-red-900 to-rose-900 text-red-100 border-red-700" />
      <StatCard title="Time Limit" value={stats.tle} className="bg-gradient-to-br from-yellow-900 to-amber-900 text-yellow-100 border-yellow-700" />
    </div>
  );
};