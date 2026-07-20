import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IQuiz } from '../../Models/Quiz/quiz';
import { IQuizForStudent } from '../../Models/interfaces';
import { IQuizAttemptResult } from '../../Models/iresult-interfaces';
import { IQuestion } from '../../Models/iquestion';

@Injectable({
  providedIn: 'root',
})
export class QuizzService {
  constructor(private httpClient: HttpClient) {

  }
  getAllQuizzes():Observable<IQuiz[]> {
    return this.httpClient.get<IQuiz[]>('https://localhost:7266/api/Quizess');
  }
  getQuizById(quizId: number|null):Observable<IQuiz> {
    return this.httpClient.get<IQuiz>(`https://localhost:7266/api/Quizess/${quizId}`);
  }
  updateQuiz(quizId: number, quiz: IQuiz):Observable<IQuiz> {
    return this.httpClient.put<IQuiz>(`https://localhost:7266/api/Quizess/${quizId}`, quiz);
  }
  deleteQuiz(quizId: number):Observable<void> {
    return this.httpClient.delete<void>(`https://localhost:7266/api/Quizess/${quizId}`);
  }
  createQuiz(quiz: IQuiz):Observable<IQuiz> {
    return this.httpClient.post<IQuiz>('https://localhost:7266/api/Quizess', quiz);
  }
  // questions
  createQuestion(quizId: number, questions: any[]):Observable<IQuestion> {
    return this.httpClient.post<IQuestion>(`https://localhost:7266/api/QuestionsAPI/${quizId}`, questions);
  }
  deleteQuestion(questionId:number) :Observable<void>{
    return this.httpClient.delete<void>(`https://localhost:7266/api/QuestionsAPI/${questionId}`)
  }
  editQuestion(questionId:number,question:IQuestion) :Observable<IQuestion>{
    return this.httpClient.put<IQuestion>(`https://localhost:7266/api/QuestionsAPI/${questionId}`, question);
  }
  getQuestionById(questionId:number):Observable<IQuestion>{
    return this.httpClient.get<IQuestion>(`https://localhost:7266/api/QuestionsAPI/${questionId}`)
  }
  takeQuiz(quizId:number):Observable<{attemptId:number, quiz:IQuizForStudent}> {
    return this.httpClient.get<{attemptId:number, quiz:IQuizForStudent}>(`https://localhost:7266/api/Quizess/TakeQuiz/${quizId}`);
  }
  submitQuiz(dto:{quizId:number, attemptId:number|null, answers:Record<number, number>}):Observable<any> {
    return this.httpClient.post<any>('https://localhost:7266/api/Quizess/SubmitQuiz', dto);
  }
  result(attemptId:number):Observable<IQuizAttemptResult>{
    return this.httpClient.get<IQuizAttemptResult>(`https://localhost:7266/api/Quizess/Result/${attemptId}`);
  }
}
