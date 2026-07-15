import { IQuestion } from "../iquestion";

export interface IQuiz {
  id: number;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  durationInMinutes: number;
  questions: IQuestion[];
}

