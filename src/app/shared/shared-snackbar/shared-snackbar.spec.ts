import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSnackbarComponent } from './shared-snackbar.component';

describe('SharedSnackbarComponent ', () => {
  let component: SharedSnackbarComponent ;
  let fixture: ComponentFixture<SharedSnackbarComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSnackbarComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
