import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProjectAddComponent } from './user-project-add.component';

describe('UserProjectAddComponent', () => {
  let component: UserProjectAddComponent;
  let fixture: ComponentFixture<UserProjectAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProjectAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
