import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs'; // Import 'of' for creating observables

import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../services/api.service'; // Import ApiService

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: any;
  let mockApiService: any; // Declare mockApiService

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    // Create a mock for ApiService
    mockApiService = {
      getProjectsByUserId: jasmine.createSpy('getProjectsByUserId').and.returnValue(of([])) // Mock method
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule], // Add HttpClientTestingModule
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ApiService, useValue: mockApiService } // Provide the mock ApiService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to new project creation page when goToNewProject is called', () => {
    component.goToNewProject();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/new-project']);
  });
});
