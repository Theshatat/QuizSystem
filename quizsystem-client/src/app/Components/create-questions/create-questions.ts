import { Component, OnInit } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-questions',
  imports: [ReactiveFormsModule],
  templateUrl: './create-questions.html',
  styleUrl: './create-questions.css',
})
export class CreateQuestions implements OnInit {
  questionsForm !: FormGroup;
  questionData: any
  quizId : number =0
  constructor(private _quizService: QuizzService,
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.params['quizId'];
      this.questionsForm = this.fb.group({
      questions: this.fb.array([this.createQuestionGroup()])
    });
  }

  createQuestionGroup(): FormGroup {
  return this.fb.group({
    text: ['', [Validators.required, Validators.minLength(15)]],
    imageUrl: [''],
    order: [1],
    answers: this.fb.array([
      this.createAnswers(),
      this.createAnswers(),
      this.createAnswers(),
      this.createAnswers(),
    ])
  });
}
  createAnswers(){
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false]
    });
  }
  get questions():FormArray{
    return this.questionsForm.get('questions') as FormArray;
  }
  getAnswers(questionIndex:number) :FormArray{
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }
  addQusetion(){
    this.questions.push(this.createQuestionGroup());
  }
  removeQuestion(index: number){
    this.questions.removeAt(index);
  }
  selectCorrectAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.controls.forEach((answerGroup, i) => {
      answerGroup.get('isCorrect')?.setValue(i === answerIndex);
    });
  }
  onSubmit(): void {
  if (this.questionsForm.invalid) {
    this.questionsForm.markAllAsTouched();
    return;
  }

  const questionRequests = this.questions.value.map((question: any) =>
    this._quizService.createQuestion(this.quizId, question)
  );

  forkJoin(questionRequests).subscribe({
    next: () => {
      this._router.navigate(['/quizzes', this.quizId]);
    },
    error: (err) => console.error('Error creating questions:', err)
  });
}
}