import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { ConfirmModal } from '../confirm-modal/confirm-modal';
import { IQuiz } from '../../Models/Quiz/quiz';

@Component({
  selector: 'app-manage-quiz',
  imports: [RouterLink],
  templateUrl: './manage-quiz.html',
  styleUrl: './manage-quiz.css',
})
export class ManageQuiz implements OnInit {
  quiz = signal<IQuiz | null>(null);
  quizId: number = 0;

  constructor(
    private _quizService: QuizzService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.params['id'];
    this.loadQuiz();
  }

  loadQuiz(): void {
    this._quizService.getQuizById(this.quizId).subscribe({
      next: (data) => this.quiz.set(data),
      error: (err) => console.error(err)
    });
  }

  deleteQuiz(): void {
    const modalRef = this.modalService.open(ConfirmModal);
    modalRef.componentInstance.title = 'Delete Quiz';
    modalRef.componentInstance.message = 'This permanently deletes this quiz and all its questions.';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this._quizService.deleteQuiz(this.quizId).subscribe({
            next: () => { this._router.navigate(['/quizzes']); },
            error: (err) => console.error(err)
          });
        }
      },
      () => {}
    );
  }

  deleteQuestion(questionId: number): void {
    const modalRef = this.modalService.open(ConfirmModal);
    modalRef.componentInstance.title = 'Delete Question';
    modalRef.componentInstance.message = 'This permanently deletes this question.';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this._quizService.deleteQuestion(questionId).subscribe({
            next: () => this.loadQuiz(), // refresh the list after deletion
            error: (err) => console.error(err)
          });
        }
      },
      () => {}
    );
  }
}