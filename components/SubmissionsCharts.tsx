"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
} from "recharts";
import { Submission } from "../types";

interface SubmissionsChartsProps {
  submissions: Submission[];
}

const COLORS = [
  "url(#grad1)", "url(#grad2)", "url(#grad3)",
  "url(#grad4)", "url(#grad5)", "url(#grad6)",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={12}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const SubmissionsCharts: React.FC<SubmissionsChartsProps> = ({ submissions }) => {
  const verdictData = useMemo(() => {
    const map: Record<string, number> = {};
    submissions.forEach(s => {
      if (!s.verdict) return;
      map[s.verdict] = (map[s.verdict] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
    }));
  }, [submissions]);

  const languageData = useMemo(() => {
    const map: Record<string, number> = {};
    submissions.forEach(s => {
      map[s.programmingLanguage] = (map[s.programmingLanguage] || 0) + 1;
    });
    return Object.entries(map).map(([lang, count]) => ({ lang, count }));
  }, [submissions]);

  return (
    <motion.div
      className="grid md:grid-cols-2 gap-8 mb-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Verdict Distribution Card */}
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 3, rotateY: -3 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 shadow-2xl border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
          <CardHeader className="text-center border-b border-slate-800/50">
            <CardTitle className="text-xl font-bold tracking-wide text-sky-400">
              Verdict Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                  <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                <Pie
                  data={verdictData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={6}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  animationBegin={100}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {verdictData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                    border: "1px solid #334155",
                    borderRadius: "0.5rem",
                    color: "white",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language Usage Card */}
      <motion.div
        whileHover={{ scale: 1.02, rotateX: -2, rotateY: 2 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 shadow-2xl border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
          <CardHeader className="text-center border-b border-slate-800/50">
            <CardTitle className="text-xl font-bold tracking-wide text-violet-400">
              Languages Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={languageData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="lang" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                    border: "1px solid #334155",
                    borderRadius: "0.5rem",
                    color: "white",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#grad4)"
                  radius={[8, 8, 0, 0]}
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {languageData.map((_, i) => (
                    <Cell key={i} fill={`url(#grad${(i % 4) + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
