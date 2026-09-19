export type Meaning = {
  label: string;
  explanation: string;
};

export type AnalysisResult = {
  objectName: string;
  category: string;
  confidence: number; // 0-100
  summary: string;
  extractedText: string[];
  meanings: Meaning[];
  usage: string;
  instructions: string[];
  warnings: string[];
  sensitiveDataDetected: boolean;
  sensitiveDataNote: string;
};

export type AnalysisSource = "ai" | "mock";

export type AnalysisResponse = {
  result: AnalysisResult;
  source: AnalysisSource;
  note: string | null;
  durationMs: number;
};

export type ScanRecord = {
  id: string;
  createdAt: string;
  fileName: string;
  thumbnail: string; // small data URL
  response: AnalysisResponse;
};
