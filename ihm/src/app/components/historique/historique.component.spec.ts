import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HistoriqueComponent } from './historique.component';
import { ApiService } from '../../services/api.service';
import { Historique } from '../../models/historique.model';
import { User } from '../../models/user.model';

/**
 * Suite de tests pour le composant HistoriqueComponent.
 */
describe('HistoriqueComponent', () => {
  /**
   * Instance du composant HistoriqueComponent.
   */
  let component: HistoriqueComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<HistoriqueComponent>;
  /**
   * Service d'API mocké pour intercepter les appels HTTP.
   */
  let mockApiService: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  const mockHistoriques: Historique[] = [
    { id: 1, oldString: 'Old1', newString: 'New1', dateM: new Date(), typeM: 0, user: mockUser },
    { id: 2, oldString: 'Old2', newString: 'New2', dateM: new Date(), typeM: 1, user: mockUser }
  ];

  beforeEach(async () => {
    mockApiService = {
      getHistoriqueForProject: jasmine.createSpy('getHistoriqueForProject').and.returnValue(of([])),
      getHistoriqueForTask: jasmine.createSpy('getHistoriqueForTask').and.returnValue(of([]))
    };

    /**
     * Configure l'environnement de test avant chaque test.
     */
    await TestBed.configureTestingModule({
      imports: [HistoriqueComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueComponent);
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
   * Teste que la méthode `loadHistory` est appelée lorsque l'entrée `projectId` change.
   */
  it('should call loadHistory when projectId changes', () => {
    spyOn(component, 'loadHistory');
    const changes: SimpleChanges = {
      projectId: new SimpleChange(undefined, 1, true)
    };
    component.projectId = 1;
    component.ngOnChanges(changes);
    expect(component.loadHistory).toHaveBeenCalled();
  });

  /**
   * Teste que la méthode `loadHistory` est appelée lorsque l'entrée `taskId` change.
   */
  it('should call loadHistory when taskId changes', () => {
    spyOn(component, 'loadHistory');
    const changes: SimpleChanges = {
      taskId: new SimpleChange(undefined, 1, true)
    };
    component.taskId = 1;
    component.ngOnChanges(changes);
    expect(component.loadHistory).toHaveBeenCalled();
  });

  /**
   * Teste que `loadHistory` n'est pas appelée si aucune des entrées (`projectId` ou `taskId`) ne change. 
   */
  it('should not call loadHistory if inputs do not change', () => {
    spyOn(component, 'loadHistory');
    component.ngOnChanges({});
    expect(component.loadHistory).not.toHaveBeenCalled();
  });

  /**
   * Teste que l'historique du projet est récupéré correctement lorsque `loadHistory` est appelée avec un `projectId`.
   */
  it('should fetch project history on loadHistory call with projectId', fakeAsync(() => {
    mockApiService.getHistoriqueForProject.and.returnValue(of(mockHistoriques));
    component.projectId = 1;
    component.loadHistory();
    tick(); // Wait for the observable to resolve
    expect(mockApiService.getHistoriqueForProject).toHaveBeenCalledWith(1);
    expect(component.historiques.length).toBe(2);
    expect(component.historiques).toEqual(mockHistoriques);
  }));

  /**
   * Teste que l'historique de la tâche est récupéré correctement lorsque `loadHistory` est appelée avec un `taskId`.
   */
  it('should fetch task history on loadHistory call with taskId', fakeAsync(() => {
    mockApiService.getHistoriqueForTask.and.returnValue(of(mockHistoriques));
    component.taskId = 1;
    component.loadHistory();
    tick(); // Wait for the observable to resolve
    expect(mockApiService.getHistoriqueForTask).toHaveBeenCalledWith(1);
    expect(component.historiques.length).toBe(2);
    expect(component.historiques).toEqual(mockHistoriques);
  }));  

  /**
   * Teste que la timeline est affichée lorsque le tableau `historiques` contient des éléments.
   */
  it('should display the timeline when historiques array has items', () => {
    component.historiques = mockHistoriques;
    fixture.detectChanges();
    const timelineElement = fixture.debugElement.query(By.css('.timeline'));
    expect(timelineElement).toBeTruthy();
    
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('Aucun historique de modification disponible.');
  });

  /**
   * Teste que le nombre correct d'éléments d'historique est rendu dans la timeline.
   */
  it('should render the correct number of history items', () => {
    component.historiques = mockHistoriques;
    fixture.detectChanges();
    const timelineItems = fixture.debugElement.queryAll(By.css('.timeline > li'));
    expect(timelineItems.length).toBe(mockHistoriques.length);
  });
});
