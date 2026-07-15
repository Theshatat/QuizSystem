import { IQuestion } from "./iquestion";

export interface IAnswer {
    id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;
  question: IQuestion;
}
