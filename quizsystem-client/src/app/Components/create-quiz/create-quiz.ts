import { Component, OnInit } from '@angular/core';
import{FormBuilder, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  imports: [ReactiveFormsModule],
  templateUrl: './create-quiz.html',
  styleUrl: './create-quiz.css',
})
export class CreateQuiz implements OnInit{
  quizForm !: FormGroup;
  quizData: any
  constructor(private _quizService: QuizzService, private _router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {  
    this.quizForm = this.fb.group({
      // Define your form controls here
      title: ['', [Validators.required, Validators.minLength(5)] ],
      description: ['', [Validators.maxLength(200)] ],
      durationInMinutes: [0, [Validators.required, Validators.min(1)] ],
    });
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const quizData = this.quizForm.value;
      this._quizService.createQuiz(quizData).subscribe({
        next: (response) => {
          this.quizData = response;
          console.log('Quiz created successfully:', response);
          // Navigate to another page or show a success message
          this._router.navigate(['/quizzes', this.quizData.id, 'Questions', 'Create']); // Example navigation
        },
        error: (error) => {
          console.error('Error creating quiz:', error);
          // Handle error, show error message to user
        }
      });
    } else {
      console.log('Form is invalid');
      // Optionally, you can mark all fields as touched to show validation errors
      this.quizForm.markAllAsTouched();
    }
  }
}
