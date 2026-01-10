import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TaskAssignComponent } from './task-assign.component';
import { ApiService } from '../../services/api.service';

describe('TaskAssignComponent', () => {
  let component: TaskAssignComponent;
  let fixture: ComponentFixture<TaskAssignComponent>;
  let mockApiService: any;

  beforeEach(async () => {
    mockApiService = {
      getUsersByProjectId: jasmine.createSpy('getUsersByProjectId').and.returnValue(of([])),
      getAllAssigned: jasmine.createSpy('getAllAssigned').and.returnValue(of([])),
      assignTaskToUser: jasmine.createSpy('assignTaskToUser').and.returnValue(of({})),
      unassignTaskFromUser: jasmine.createSpy('unassignTaskFromUser').and.returnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [TaskAssignComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
