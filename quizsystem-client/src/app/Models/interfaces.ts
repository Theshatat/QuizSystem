export interface IAnswerForStudent {
  id: number;
  text: string;
}

// Models/Quiz/question-for-student.ts
export interface IQuestionForStudent {
  id: number;
  text: string;
  imageUrl?: string | null;
  answers: IAnswerForStudent[];
}

// Models/Quiz/quiz-for-student.ts
export interface IQuizForStudent {
  id: number;
  title: string;
  description: string;
  durationInMinutes: number;
  questions: IQuestionForStudent[];
}