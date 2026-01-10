import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskNewComponent } from './task-new.component';
import { ApiService } from '../../services/api.service';
import { Task } from '../../models/task.model';

describe('TaskNewComponent', () => {
  let component: TaskNewComponent;
  let fixture: ComponentFixture<TaskNewComponent>;
  let mockApiService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockTask: Task = { id: 1, nom: 'Test Task', description: 'Test Description', projectId: 1, dateFin: new Date(),dateEcheance: new Date(), priorite: "HIGH", status: "TODO" };

  beforeEach(async () => {
    mockApiService = {
      createTask: jasmine.createSpy('createTask').and.returnValue(of(mockTask))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [TaskNewComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
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
