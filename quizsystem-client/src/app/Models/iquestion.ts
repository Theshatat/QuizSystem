import { IAnswer } from "./ianswer";

export interface IQuestion {
  id :number
  text: string;
  imageUrl?: string | null;
  order: number;
  answers: IAnswer[];
}
