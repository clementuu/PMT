import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HistoriqueComponent } from './historique.component';
import { ApiService } from '../../services/api.service';

describe('HistoriqueComponent', () => {
  let component: HistoriqueComponent;
  let fixture: ComponentFixture<HistoriqueComponent>;
  let mockApiService: any;

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
});
