import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs'; // Import 'of' for creating observables

import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../services/api.service'; // Import ApiService

/**
 * Suite de tests pour le composant DashboardComponent.
 */
describe('DashboardComponent', () => {
  /**
   * Instance du composant DashboardComponent.
   */
  let component: DashboardComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<DashboardComponent>;
  /**
   * Mock du service Router.
   */
  let mockRouter: any;
  /**
   * Mock du service ApiService.
   */
  let mockApiService: any;

  /**
   * Configure l'environnement de test avant chaque test.
   */
  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    // Création d'un mock pour ApiService
    mockApiService = {
      getProjectsByUserId: jasmine.createSpy('getProjectsByUserId').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ApiService, useValue: mockApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Vérifie si la méthode goToNewProject navigue correctement.
   */
  it('should navigate to new project creation page when goToNewProject is called', () => {
    component.goToNewProject();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/new-project']);
  });
});