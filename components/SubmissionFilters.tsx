"use client";

import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Code, CheckCircle, Star } from "lucide-react";

interface SubmissionFiltersProps {
  problemNameFilter: string;
  setProblemNameFilter: (value: string) => void;
  verdictFilter: string;
  setVerdictFilter: (value: string) => void;
  uniqueVerdicts: string[];
  languageFilter: string;
  setLanguageFilter: (value: string) => void;
  uniqueLanguages: string[];
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
  uniqueRatings: string[];
}

export const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({
  problemNameFilter,
  setProblemNameFilter,
  verdictFilter,
  setVerdictFilter,
  uniqueVerdicts,
  languageFilter,
  setLanguageFilter,
  ratingFilter,
  setRatingFilter,
  uniqueRatings,
  uniqueLanguages
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    > 
      {/* 🧩 Problem Name Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Search size={16} /> Problem Name
        </Label>
        <Input
          placeholder="Search problem..."
          value={problemNameFilter}
          onChange={(e) => setProblemNameFilter(e.target.value)}
          className="bg-white dark:bg-slate-900"
        />
      </div>

      {/* ✅ Verdict Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <CheckCircle size={16} /> Verdict
        </Label>
        <Select value={verdictFilter} onValueChange={setVerdictFilter}>
          <SelectTrigger
            className="bg-white dark:bg-slate-900"
          >
            <SelectValue placeholder="All verdicts" />
          </SelectTrigger>
          <SelectContent>
            {uniqueVerdicts.map((v) => (
              <SelectItem key={v} value={v}>
                {v.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 💻 Language Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Code size={16} /> Language
        </Label>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger
            className="bg-white dark:bg-slate-900"
          >
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            {uniqueLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ⭐ Rating Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Star size={16} /> Rating
        </Label>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger
            className="bg-white dark:bg-slate-900"
          >
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            {uniqueRatings.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
