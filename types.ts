
export type Language = 'ar' | 'so';
export type Role = 'teacher' | 'student' | 'supervisor';
export type ProgressStatus = 'correct' | 'incorrect';
export type ProgressType = 'hifz' | 'murajaah';

export interface ProgressRecord {
  id: string;
  date: string; // ISO string
  type: ProgressType;
  status: ProgressStatus;
  surah: string; 
  details: string; // e.g., "Al-Baqarah: 1-5" for Hifz, or Surah name for revision
}

export interface Period {
  id: string;
  name: string;
  nameAr: string;
}

export interface Halaqa {
  id: string;
  name: string;
  nameAr: string;
  periodId: string;
  teacherId: string;
}

export interface Student {
  id: string;
  name: string;
  nameAr: string;
  halaqaId: string;
  progress: ProgressRecord[];
}

export interface Teacher {
  id: string;
  name: string;
  nameAr: string;
}