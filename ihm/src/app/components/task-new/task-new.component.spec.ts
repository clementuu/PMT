import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNewComponent } from './task-new.component';

describe('TaskNewComponent', () => {
  let component: TaskNewComponent;
  let fixture: ComponentFixture<TaskNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
