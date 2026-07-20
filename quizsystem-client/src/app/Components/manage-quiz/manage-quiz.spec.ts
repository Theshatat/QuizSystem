import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuiz } from './manage-quiz';

describe('ManageQuiz', () => {
  let component: ManageQuiz;
  let fixture: ComponentFixture<ManageQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageQuiz],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageQuiz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
