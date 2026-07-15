import { IAnswer } from "./ianswer";
import { IQuiz } from "./Quiz/quiz";

export interface IQuestion {
     id: number;
  text: string;
  imageUrl?: string | null;
  order: number;
  quizId: number;
  quiz: IQuiz;
  answers: IAnswer[];
}
