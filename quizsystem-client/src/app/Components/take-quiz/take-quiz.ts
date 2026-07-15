import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { IQuizForStudent } from '../../Models/interfaces';

@Component({
  selector: 'app-take-quiz',
  imports: [NgIf],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.css',
})
export class TakeQuiz implements OnInit,OnDestroy {
  selectedQuiz=  signal<IQuizForStudent | null>(null);
  attemptId=  signal<number | null>(null);
  answers=  signal<Record<number, number>>({});
  remainingSeconds = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitted = signal(false);

  private timerHandle: any;

  constructor(private _quiz: QuizzService, private _router: Router,
     private _activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    const quizId = +this._activatedRoute.snapshot.params['id'];
    this._quiz.takeQuiz(quizId).subscribe({
      next:(res)=>{
        this.selectedQuiz.set(res.quiz);
        this.startTimer(res.quiz.durationInMinutes);
        this.attemptId.set(res.attemptId);
        this.loading.set(false);
      }
  });
}

  private startTimer(durationInMinutes: number) {
    this.remainingSeconds.set(durationInMinutes * 60);
    this.timerHandle = setInterval(()=>{
      const currentSeconds = this.remainingSeconds()-1;
      this.remainingSeconds.set(currentSeconds);
      if(currentSeconds <= 0){
        this.onSubmit();
      }
    },1000);
  }
  // Utility function to get the keys of an object
  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
  selectAnswer(questionId: number, answerId: number): void {
    this.answers.update(current => ({
      ...current,
      [questionId]: answerId   // this is the "set", not "read", we talked about
    }));
  }
  onSubmit(): void {
    if (this.submitted()) return; // prevent double-submit
    this.submitted.set(true);
    clearInterval(this.timerHandle);

    // Prepare the data to submit
    const dto = {
      quizId: this.selectedQuiz()!.id,
      attemptId: this.attemptId(),
      answers: this.answers()
    };
    // Submit the quiz using the QuizzService
    this._quiz.submitQuiz(dto).subscribe({
      next: (result) => {
        this._router.navigate(['/quizzes', this.selectedQuiz()!.id, 'result', result.attemptId]);
      },
      error: (err) => {
        this.error.set('Failed to submit quiz');
        this.submitted.set(false);
      }
    });
  }
  // 
  ngOnDestroy(): void {
    clearInterval(this.timerHandle);
  }
}
