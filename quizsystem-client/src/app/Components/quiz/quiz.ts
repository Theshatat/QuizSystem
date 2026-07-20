import { Component, OnInit, signal } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { IQuiz } from '../../Models/Quiz/quiz';
import { Router } from '@angular/router';
import { HttpClientService } from '../../Services/HttpService/http-client-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../confirm-modal/confirm-modal';
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
  isInstructor : boolean =false;
  error = signal<string | null>(null);
  constructor(private quizzService: QuizzService,private modalService: NgbModal, private _routerService: Router, private authService: HttpClientService) {}
  ngOnInit(): void {
    this.isInstructor = this.authService.isInstructorOrAdmin();
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
  navigate() {
    this._routerService.navigate(['/create-quiz']);
  }
  deleteQuiz(quizId: number): void {
  const modalRef = this.modalService.open(ConfirmModal);
  modalRef.componentInstance.title = 'Delete Quiz';
  modalRef.componentInstance.message = 'This will permanently delete this quiz and all its questions. Continue?';

  modalRef.result.then(
    (confirmed) => {
      if (confirmed) {
        this.quizzService.deleteQuiz(quizId).subscribe({
          next: () => {
            this.myQuizzes.update(current => current.filter(q => q.id !== quizId));
          },
          error: (err) => console.error('Error deleting quiz:', err)
        });
      }
    },
    () => { /* dismissed, do nothing */ }
  );
}
}
