// app/stats/StatsView.tsx
'use client';

import { BarChart, Check, TrendingUp, Target } from 'lucide-react';
import { useState, useMemo, FC } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

type Submission = {
  id: number;
  creationTimeSeconds: number;
  verdict?: string;
  problem: {
    contestId: number;
    index: string;
    name: string;
  };
};

type TimeGroupedData = {
  labels: string[];
  solved: number[];
  wrong: number[];
};

type VerdictDistribution = {
  labels: string[];
  data: number[];
};

type TimePeriod = 'daily' | 'weekly' | 'monthly';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

// Helper to process submissions for a given time period
function processSubmissionsByTime(
  submissions: Submission[],
  period: TimePeriod
): TimeGroupedData {
  if (submissions.length === 0) {
    return { labels: [], solved: [], wrong: [] };
  }

  const firstSubmissionDate = new Date(submissions[0].creationTimeSeconds * 1000);
  const lastSubmissionDate = new Date(submissions[submissions.length - 1].creationTimeSeconds * 1000);

  let intervalFns, formatStr, startOfPeriod, endOfPeriod;

  switch (period) {
    case 'weekly':
      intervalFns = eachWeekOfInterval;
      formatStr = 'MMM d, yyyy';
      startOfPeriod = startOfWeek;
      endOfPeriod = endOfWeek;
      break;
    case 'monthly':
      intervalFns = eachMonthOfInterval;
      formatStr = 'MMM yyyy';
      startOfPeriod = startOfMonth;
      endOfPeriod = endOfMonth;
      break;
    case 'daily':
    default:
      intervalFns = eachDayOfInterval;
      formatStr = 'MMM d';
      startOfPeriod = startOfDay;
      endOfPeriod = endOfDay;
      break;
  }

  const intervals = intervalFns({ start: firstSubmissionDate, end: lastSubmissionDate });
  const labels = intervals.map(date => format(date, formatStr));
  const solved = new Array(intervals.length).fill(0);
  const wrong = new Array(intervals.length).fill(0);

  let submissionIndex = 0;
  for (let i = 0; i < intervals.length; i++) {
    const intervalStart = startOfPeriod(intervals[i]);
    const intervalEnd = endOfPeriod(intervals[i]);

    while (submissionIndex < submissions.length) {
      const submissionTime = new Date(submissions[submissionIndex].creationTimeSeconds * 1000);
      if (submissionTime > intervalEnd) {
        break; // Move to the next interval
      }

      if (submissionTime >= intervalStart) {
        if (submissions[submissionIndex].verdict === 'OK') {
          solved[i]++;
        } else {
          wrong[i]++;
        }
      }
      submissionIndex++;
    }
  }

  return { labels, solved, wrong };
}

// Helper to process submissions for verdict distribution
function processVerdictDistribution(submissions: Submission[]): VerdictDistribution {
  const verdictCounts: { [key: string]: number } = {};
  submissions.forEach(sub => {
    const verdict = sub.verdict || 'UNKNOWN';
    verdictCounts[verdict] = (verdictCounts[verdict] || 0) + 1;
  });

  const sortedVerdicts = Object.entries(verdictCounts).sort(([, a], [, b]) => b - a);

  const labels = sortedVerdicts.map(([verdict]) =>
    verdict.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
  const data = sortedVerdicts.map(([, count]) => count);

  return { labels, data };
}

const StatCard: FC<StatCardProps & { icon: React.ElementType }> = ({ title, value, description, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center gap-4">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
        <Icon className="size-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
    </div>
);

const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const },
  },
};

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Submissions Over Time',
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
};

const pieChartOptions = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    title: {
      display: true,
      text: 'Verdict Distribution',
    },
  },
};

const PIE_CHART_COLORS = [
  'rgba(75, 192, 192, 0.6)',
  'rgba(255, 99, 132, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(201, 203, 207, 0.6)',
];

export default function StatsView({ submissions }: { submissions: Submission[] }) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');

  const { totalSubmissions, totalSolved, successRate, avgAttempts } = useMemo(() => {
    const total = submissions.length;
    const solvedProblems = new Set(submissions.filter(s => s.verdict === 'OK').map(s => s.problem.name));
    const solvedCount = solvedProblems.size;
    const rate = total > 0 ? ((solvedCount / total) * 100).toFixed(1) + '%' : 'N/A';
    const attempts = total > 0 ? (total / solvedCount).toFixed(2) : 'N/A';
    return { totalSubmissions: total, totalSolved: solvedCount, successRate: rate, avgAttempts: attempts };
  }, [submissions]);

  const barChartData = useMemo(() => {
    const { labels, solved, wrong } = processSubmissionsByTime(submissions, timePeriod);
    return {
      labels,
      datasets: [
        {
          label: 'Solved',
          data: solved,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Wrong/Other',
          data: wrong,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [submissions, timePeriod]);

  const pieChartData = useMemo(() => {
    const { labels, data } = processVerdictDistribution(submissions);
    return {
      labels,
      datasets: [
        { label: 'Verdicts', data, backgroundColor: PIE_CHART_COLORS },
      ],
    };
  }, [submissions, timePeriod]);

  if (submissions.length === 0) {
    return <p>No submission data found for this user.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Submissions" value={totalSubmissions} description="All attempts made." icon={BarChart} />
        <StatCard title="Unique Solved" value={totalSolved} description="Distinct problems solved." icon={Check} />
        <StatCard title="Success Rate" value={successRate} description="Unique solved vs. total submissions." icon={TrendingUp} />
        <StatCard title="Avg. Attempts" value={avgAttempts} description="Per unique solved problem." icon={Target} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map((period, idx) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 ${
                    timePeriod === period
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  } ${idx === 0 ? 'rounded-l-lg border-l' : ''} ${
                    idx === 2 ? 'rounded-r-lg border-r' : ''
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-96"><Bar options={barChartOptions} data={barChartData} /></div>
        </div>
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <div className="relative h-96 w-96"><Pie data={pieChartData} options={pieChartOptions} /></div>
        </div>
      </div>
    </div>
  );
}