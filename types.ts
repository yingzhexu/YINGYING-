export enum Gender {
  FEMALE = '女性',
  MALE = '男性',
  GIRL = '女童',
  BOY = '男童',
}

export enum ProcessingStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface FashionItem {
  id: string;
  originalFile: File;
  previewUrl: string;
  generatedImageUrl?: string;
  status: ProcessingStatus;
  error?: string;
}

export interface GenerationSettings {
  gender: Gender;
}