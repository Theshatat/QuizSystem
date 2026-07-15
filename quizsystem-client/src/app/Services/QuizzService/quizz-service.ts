import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IQuiz } from '../../Models/Quiz/quiz';
import { IQuizForStudent } from '../../Models/interfaces';

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
  takeQuiz(quizId:number):Observable<{attemptId:number, quiz:IQuizForStudent}> {
    return this.httpClient.get<{attemptId:number, quiz:IQuizForStudent}>(`https://localhost:7266/api/Quizess/TakeQuiz/${quizId}`);
  }
  submitQuiz(dto:{quizId:number, attemptId:number|null, answers:Record<number, number>}):Observable<any> {
    return this.httpClient.post<any>('https://localhost:7266/api/Quizess/SubmitQuiz', dto);
  }
}
