import { Component, OnInit, signal } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { IQuiz } from '../../Models/Quiz/quiz';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quiz-details',
  imports: [DatePipe],
  templateUrl: './quiz-details.html',
  styleUrl: './quiz-details.css',
})
export class QuizDetails implements OnInit {
  // currentId: number = 0;
  currentId = signal(0);
  // quizDetails: IQuiz | null = null;
  quizDetails = signal<IQuiz | null>(null);

  constructor(private quizService: QuizzService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // this.currentId = +params['id'];
      this.currentId.set(+params['id']);

      this.quizService.getQuizById(this.currentId()).subscribe({
        next: (data) => {
          // this.quizDetails = data;
          this.quizDetails.set(data);
          console.log('Quiz Details:', this.quizDetails());
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }
}