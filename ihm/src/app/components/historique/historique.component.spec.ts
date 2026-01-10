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

describe('HistoriqueComponent', () => {
  let component: HistoriqueComponent;
  let fixture: ComponentFixture<HistoriqueComponent>;
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadHistory when projectId changes', () => {
    spyOn(component, 'loadHistory');
    const changes: SimpleChanges = {
      projectId: new SimpleChange(undefined, 1, true)
    };
    component.projectId = 1;
    component.ngOnChanges(changes);
    expect(component.loadHistory).toHaveBeenCalled();
  });

  it('should call loadHistory when taskId changes', () => {
    spyOn(component, 'loadHistory');
    const changes: SimpleChanges = {
      taskId: new SimpleChange(undefined, 1, true)
    };
    component.taskId = 1;
    component.ngOnChanges(changes);
    expect(component.loadHistory).toHaveBeenCalled();
  });

  it('should not call loadHistory if inputs do not change', () => {
    spyOn(component, 'loadHistory');
    component.ngOnChanges({});
    expect(component.loadHistory).not.toHaveBeenCalled();
  });

  it('should fetch project history on loadHistory call with projectId', fakeAsync(() => {
    mockApiService.getHistoriqueForProject.and.returnValue(of(mockHistoriques));
    component.projectId = 1;
    component.loadHistory();
    tick(); // Wait for the observable to resolve
    expect(mockApiService.getHistoriqueForProject).toHaveBeenCalledWith(1);
    expect(component.historiques.length).toBe(2);
    expect(component.historiques).toEqual(mockHistoriques);
  }));

  it('should fetch task history on loadHistory call with taskId', fakeAsync(() => {
    mockApiService.getHistoriqueForTask.and.returnValue(of(mockHistoriques));
    component.taskId = 1;
    component.loadHistory();
    tick(); // Wait for the observable to resolve
    expect(mockApiService.getHistoriqueForTask).toHaveBeenCalledWith(1);
    expect(component.historiques.length).toBe(2);
    expect(component.historiques).toEqual(mockHistoriques);
  }));

  it('should display the timeline when historiques array has items', () => {
    component.historiques = mockHistoriques;
    fixture.detectChanges();
    const timelineElement = fixture.debugElement.query(By.css('.timeline'));
    expect(timelineElement).toBeTruthy();
    
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('Aucun historique de modification disponible.');
  });

  it('should render the correct number of history items', () => {
    component.historiques = mockHistoriques;
    fixture.detectChanges();
    const timelineItems = fixture.debugElement.queryAll(By.css('.timeline > li'));
    expect(timelineItems.length).toBe(mockHistoriques.length);
  });
});
