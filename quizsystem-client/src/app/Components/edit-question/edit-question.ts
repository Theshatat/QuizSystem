import { Component, OnInit } from '@angular/core';
import { QuizzService } from '../../Services/QuizzService/quizz-service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-question',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-question.html',
  styleUrl: './edit-question.css',
})
export class EditQuestion implements OnInit{
  questionId:number =0;
  questionsForm !: FormGroup;
  constructor(private _quizServices:QuizzService, 
    private _router:ActivatedRoute,
    private _location:Location,
    private fb:FormBuilder){}

  ngOnInit(): void {
  this.questionId = +this._router.snapshot.params['id'];

  this.questionsForm = this.fb.group({
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
  this._quizServices.getQuestionById(this.questionId).subscribe({
    next: (question) => {
      this.questionsForm.patchValue({
        text: question.text,
        imageUrl: question.imageUrl,
        order: question.order,
      });
      // patch each answer individually — answers is a FormArray, not a simple field
      question.answers.forEach((answer, i) => {
        this.answers.at(i).patchValue({
          id: answer.id,
          text: answer.text,
          isCorrect: answer.isCorrect,
        });
      });
    },
    error: (err) => console.error('Error loading question:', err)
  });
}
  createAnswers(){
    return this.fb.group({
      id:[0],
      text: ['', Validators.required],
      isCorrect: [false]
    });
  }
  get answers(): FormArray {
  return this.questionsForm.get('answers') as FormArray;
}
  selectCorrectAnswer(answerIndex: number): void {
  this.answers.controls.forEach((answerGroup, i) => {
    answerGroup.get('isCorrect')?.setValue(i === answerIndex);
  });
}
    onSubmit(): void {
  if (this.questionsForm.invalid) {
    this.questionsForm.markAllAsTouched();
    return;
  }

  this._quizServices.editQuestion(this.questionId, this.questionsForm.value).subscribe({
    next: () => {
      this._location.back();
    },
    error: (err) => console.error('Error updating question:', err)
  });
}
}
