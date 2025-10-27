"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useCodeforcesSubmissions } from "@/hooks/useCodeforcesSubmissions";
import { SubmissionsCharts } from "@/components/SubmissionsCharts";
import { Stats } from "@/components/Stats";

const DashboardPage: React.FC = () => {
  const handle = "sachin_bh123";
  const submissionCount = 100;

  const { allSubmissions, loading, error, fetchSubmissions } = useCodeforcesSubmissions(handle, submissionCount);

  // 🌌 Fancy Loading State
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4 text-indigo-400 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900">
        <RefreshCw className="animate-spin w-10 h-10 text-indigo-400" />
        <p className="text-lg font-semibold animate-pulse tracking-wide">Fetching submissions...</p>
      </div>
    );

  // ❌ Error State
  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-950 via-red-900 to-red-800 text-red-300 border border-red-700/40 rounded-lg p-6 mx-6 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
        <h2 className="text-2xl font-bold mb-2">⚠️ Error Loading Data</h2>
        <p>{error}</p>
        <Button
          onClick={fetchSubmissions}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Try Again
        </Button>
      </div>
    );

  return (
    <div className="relative px-6 md:px-10 pb-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900 min-h-screen text-slate-100 overflow-hidden">
      {/* 🌈 Background Orbs */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-700/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-purple-700/40 rounded-full blur-3xl animate-pulse"></div>

      {/* 🚀 Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="max-w-7xl mx-auto shadow-[0_0_40px_rgba(99,102,241,0.6)] border border-indigo-700/60 bg-slate-900/90 backdrop-blur-lg rounded-2xl animate-fade-in-up">
          <CardHeader className="border-b border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-indigo-900/70 to-purple-900/60 rounded-t-2xl shadow-[0_0_25px_rgba(99,102,241,0.3)]">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-200 tracking-wide">
                Dashboard — <span className="text-indigo-400">{handle}</span>
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
            <Button
              onClick={fetchSubmissions}
              variant="outline"
              className="mt-3 sm:mt-0 bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold shadow-md"
            >
              <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* 📊 Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Stats submissions={allSubmissions} />
            </motion.div>

            {/* 📈 Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <SubmissionsCharts submissions={allSubmissions} />
            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-center items-center bg-slate-950/70 border-t border-slate-800 p-6 rounded-b-2xl">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-700 hover:to-fuchsia-600 text-white font-semibold px-6 py-2 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.5)]"
              >
                View All Submissions
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
