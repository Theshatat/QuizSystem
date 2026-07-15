import { Component, OnInit, signal } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { IQuiz } from '../../Models/Quiz/quiz';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit{
  // myQuizzes: IQuiz[] = []; using signal for reactivity
  myQuizzes = signal<IQuiz[]>([]);
  // selectedQuiz: IQuiz| null = null
  selectedQuiz = signal<IQuiz | null>(null);
  // loading: boolean = true;
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  constructor(private quizzService: QuizzService, private _routerService: Router) {}
ngOnInit(): void {
    this.quizzService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        this.myQuizzes.set(quizzes);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load quizzes');
        this.loading.set(false);
      }
    });
  }
  getQuizById(quizId: number) {
    this.quizzService.getQuizById(quizId).subscribe(
      (quiz) => {
        this.selectedQuiz.set(quiz);
        console.log('Quiz:', quiz);
      },
      (error) => {
        console.error(`Error fetching quiz with ID ${quizId}:`, error);
      }
    );
  }
  updateQuiz(quizId: number, quizData: any) {
    this.quizzService.updateQuiz(quizId, quizData).subscribe(
      (updatedQuiz) => {
        console.log('Updated Quiz:', updatedQuiz);
      },
      (error) => {
        console.error(`Error updating quiz with ID ${quizId}:`, error);
      }
    );
  }
  deleteQuiz(quizId: number) {
    this.quizzService.deleteQuiz(quizId).subscribe(
      () => {
        console.log(`Quiz with ID ${quizId} deleted successfully.`);
      },
      (error) => {
        console.error(`Error deleting quiz with ID ${quizId}:`, error);
      }
    );
  }
  createQuiz(quizData: any) {
    this.quizzService.createQuiz(quizData).subscribe(
      (newQuiz) => {
        console.log('New Quiz Created:', newQuiz);
      },
      (error) => {
        console.error('Error creating new quiz:', error);
      }
    );
  }
  navigateByUrl(quizId: number) {
    // window.location.href = `/quizzes/${quizId}`;
    this._routerService.navigate(['/quizzes',quizId]);

  }
}
