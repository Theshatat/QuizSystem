import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestions } from './create-questions';

describe('CreateQuestions', () => {
  let component: CreateQuestions;
  let fixture: ComponentFixture<CreateQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuestions],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
