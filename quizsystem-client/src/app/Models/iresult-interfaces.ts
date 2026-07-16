export interface IAnswerResult {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface IQuestionResult {
  id: number;
  text: string;
  answers: IAnswerResult[];
  selectedAnswerId: number | null;
}

export interface IQuizAttemptResult {
  attemptId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  startedAt: string;
  finishedAt: string | null;
  questions: IQuestionResult[];
}