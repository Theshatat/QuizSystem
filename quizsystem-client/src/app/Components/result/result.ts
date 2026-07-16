import { Component, OnInit, signal } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { ActivatedRoute } from '@angular/router';
import { IQuizAttemptResult } from '../../Models/iresult-interfaces';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-result',
  imports: [DatePipe,DecimalPipe],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result implements OnInit {
  attempt = signal<IQuizAttemptResult | null>(null);
  totalQuestions = signal<number | null>(null);
  score= signal<number | null>(null);
  startedAt = signal<string | null>(null);
  finishedAt = signal<string | null>(null);
  constructor(private quizzService: QuizzService,private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    const attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));
    this.quizzService.result(attemptId).subscribe({
      next: (data) => {
        this.attempt.set(data);
        this.totalQuestions.set(data.questions.length);
        this.score.set(data.score);
        this.startedAt.set(data.startedAt);
        this.finishedAt.set(data.finishedAt);
        console.log('Attempt Result:', this.attempt());
      },
      error: (err) => {
        console.error(err);
      }
    });
      
  }
}
