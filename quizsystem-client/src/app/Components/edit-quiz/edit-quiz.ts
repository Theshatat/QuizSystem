import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzService } from '../../Services/QuizzService/quizz-service';

@Component({
  selector: 'app-edit-quiz',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-quiz.html',
  styleUrl: './edit-quiz.css',
})
export class EditQuiz implements OnInit {
  quizForm!: FormGroup;
  quizId: number = 0;

  constructor(
    private _quizService: QuizzService,
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.params['id'];

    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.maxLength(200)]],
      durationInMinutes: [0, [Validators.required, Validators.min(1)]],
    });

    // load existing values and patch the form
    this._quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quizForm.patchValue({
          title: quiz.title,
          description: quiz.description,
          durationInMinutes: quiz.durationInMinutes,
        });
      },
      error: (err) => console.error('Error loading quiz:', err)
    });
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    this._quizService.updateQuiz(this.quizId, this.quizForm.value).subscribe({
      next: () => {
        this._router.navigate(['/quizzes', 'manage-quiz',this.quizId]);
      },
      error: (err) => console.error('Error updating quiz:', err)
    });
  }
}