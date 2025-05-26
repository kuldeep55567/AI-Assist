export interface JobOpening {
  id: number;
  job_title: string;
  department: string;
  experience_min: number;
  experience_max: number;
  notice_period_days: number;
  available_positions: number;
  total_applied: number;
  is_open: number;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewStage {
  id: number;
  job_id: number;
  round_number: number;
  round_type: string;
  title: string;
  description: string;
  duration_minutes: number;
  created_at?: string;
  updated_at?: string;
  questions?: StageQuestion[];
}

export interface StageQuestion {
  id: number;
  interview_stage_id: number;
  question_text: string;
  question_type: string;
  options: string | string[]; // Stored as JSON string in DB, parsed as array in client
  correct_option_index?: number;
  difficulty_level?: string;
  marks?: number;
  time_limit_seconds?: number;
  expected_keywords?: string | string[];
  created_at?: string;
  updated_at?: string;
}

export interface JobWithDetails extends JobOpening {
  rounds?: InterviewStage[];
}

export interface QuestionData {
  interview_stage_id: number;
  question_text: string;
  options: string[];
  correct_option_index: number;
  question_type: string;
  difficulty_level: string;
  marks: number;
  time_limit_seconds: number;
  expected_keywords?: string[];
}

export interface JobRoundDetails {
  job_id: number;
  job_title: string;
  department: string;
  experience_min: number;
  experience_max: number;
  round_id: number;
  round_number: number;
  round_type: string;
  round_title: string;
  description?: string;
}
// app/types/interface.ts
export interface JobOpening {
  id: number;
  job_title: string;
  department: string;
  description: string;
  location: string;
  job_type: string;
  experience_min: number;
  experience_max: number;
  is_open: number;
  available_positions: number;
  total_applied: number;
  notice_period_days: number;
}

export interface JobApplication {
  email: string;
  designation: string;
  job_id: number;
  position: string;
  experience: string;
  highest_education: string;
  previously_employed: boolean;
  status: string;
}