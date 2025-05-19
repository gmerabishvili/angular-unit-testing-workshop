import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';

// === WITH TestBed ===
describe('AppComponent - WITH TestBed', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let start: number;

  beforeAll(() => {
    start = performance.now();
  });

  afterAll(() => {
    const duration = performance.now() - start;
    console.log(`[WITH TestBed] Total time: ${duration.toFixed(2)}ms`);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        MatIconModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});


// === WITHOUT TestBed ===
describe('AppComponent - WITHOUT TestBed', () => {
  let component: AppComponent;

  let start: number;

  beforeAll(() => {
    start = performance.now();
  });

  afterAll(() => {
    const duration = performance.now() - start;
    console.log(`[WITHOUT TestBed] Total time: ${duration.toFixed(2)}ms`);
  });

  beforeEach(() => {
    component = new AppComponent();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
