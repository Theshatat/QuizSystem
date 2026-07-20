import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestion } from './edit-question';

describe('EditQuestion', () => {
  let component: EditQuestion;
  let fixture: ComponentFixture<EditQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuestion],
    }).compileComponents();

    fixture = TestBed.createComponent(EditQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
