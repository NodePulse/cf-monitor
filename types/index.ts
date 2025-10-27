export interface Problem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  points?: number;
  rating?: number;
  tags: string[];
}

export interface Submission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  problem: Problem;
  programmingLanguage: string;
  verdict?: string;
}

export interface CodeforcesResponse<T> {
  status: "OK" | "FAILED";
  comment?: string;
  result: T;
}