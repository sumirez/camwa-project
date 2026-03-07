import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLecturerComponent } from './dashboard-lecturer.component';

describe('DashboardLecturerComponent', () => {
  let component: DashboardLecturerComponent;
  let fixture: ComponentFixture<DashboardLecturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLecturerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLecturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
