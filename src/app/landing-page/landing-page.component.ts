import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsuranceTableComponent } from '../insurance-table/insurance-table.component';
import { SmokerButtonValueAccessorDirective } from '../smoker-button-value-accessor-directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    InsuranceTableComponent,
    SmokerButtonValueAccessorDirective,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container">
      <h1 class="my-4">Insurance Application</h1>
      <section>
        <form
          #myForm="ngForm"
          [formGroup]="applyForm"
          (submit)="submitApplication()"
        >
          <!-- Age Form Group -->
          <div class="mb-3">
            <label for="age" class="form-label">Age</label>
            <input
              id="age"
              type="number"
              class="form-control"
              formControlName="age"
              name="age"
            />
            <div *ngIf="applyForm.get('age')?.invalid && applyForm.get('age')?.touched">
              <div *ngIf="applyForm.get('age')?.hasError('required')" class="alert alert-danger">
                Age is required.
              </div>
              <div *ngIf="applyForm.get('age')?.hasError('min') && applyForm.get('age')?.touched" class="alert alert-danger">
                Age must be at least 1.
              </div>
              <div *ngIf="applyForm.get('age')?.hasError('max') && applyForm.get('age')?.touched" class="alert alert-danger">
                Age must not exceed 100.
              </div>
            </div>
          </div>

          <!-- Sex Form Group -->
          <div class="mb-3">
            <label class="form-label">Sex</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sex"
                id="femaleRadio"
                value="female"
                formControlName="sex"
                checked
              />
              <label class="form-check-label" for="femaleRadio">Female</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sex"
                id="maleRadio"
                value="male"
                formControlName="sex"
              />
              <label class="form-check-label" for="maleRadio">Male</label>
            </div>
          </div>

          <!-- BMI Form Group -->
          <div class="mb-3">
            <label for="bmi" class="form-label">BMI</label>
            <input
              id="bmi"
              type="number"
              class="form-control"
              formControlName="bmi"
              name="bmi"
            />
            <div *ngIf="applyForm.get('bmi')?.invalid && applyForm.get('bmi')?.touched">
              <div *ngIf="applyForm.get('bmi')?.hasError('required')" class="alert alert-danger">
                BMI is required.
              </div>
              <div *ngIf="applyForm.get('bmi')?.hasError('min')" class="alert alert-danger">
                BMI must be at least 1.
              </div>
              <div *ngIf="applyForm.get('bmi')?.hasError('max')" class="alert alert-danger">
                BMI must not exceed 100.
              </div>
            </div>
          </div>

          <!-- Number of Children Form Group -->
          <div class="mb-3">
            <label for="numOfChildren" class="form-label">Number of Children</label>
            <input
              id="numOfChildren"
              type="number"
              class="form-control"
              formControlName="numOfChildren"
              name="numOfChildren"
            />
          </div>

          <!-- Smoker Form Group -->
          <div class="mb-3">
            <label for="smoker" class="form-label">Smoker</label>
            <div class="d-flex">
              <button
                type="button"
                class="btn btn-success me-2"
                [smokerButton]="'yes'"
                formControlName="smoker"
              >
                Yes
              </button>
              <button
                type="button"
                class="btn btn-danger"
                [smokerButton]="'no'"
                formControlName="smoker"
              >
                No
              </button>
            </div>
          </div>

          <!-- Region Form Group -->
          <div class="mb-3">
            <label for="region" class="form-label">Region</label>
            <select
              class="form-select"
              formControlName="region"
              id="region"
            >
              <option value="">None</option>
              <option value="north">North</option>
              <option value="northeast">North-East</option>
              <option value="northwest">North-West</option>
              <option value="south">South</option>
              <option value="southeast">South-East</option>
              <option value="southwest">South-West</option>
              <option value="central">Central</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button
            class="btn btn-primary"
            type="submit"
            [disabled]="applyForm.invalid"
          >
            Submit
          </button>
        </form>
      </section>

      <div class="mt-4">
        <app-insurance-table></app-insurance-table>
      </div>
    </div>
  `,
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  applyForm: FormGroup;

  constructor() {
    this.applyForm = new FormGroup({
      age: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      sex: new FormControl(''),
      bmi: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      numOfChildren: new FormControl(''),
      smoker: new FormControl(''),
      region: new FormControl(''),
    });
  }

  submitApplication() {
    console.log(`
      Insurance received: age: ${this.applyForm.value.age},\n
      sex: ${this.applyForm.value.sex},\n
      bmi: ${this.applyForm.value.bmi},\n
      number of children: ${this.applyForm.value.numOfChildren},\n
      smoker: ${this.applyForm.value.smoker},\n
      region: ${this.applyForm.value.region},\n
      charges: ${this.calculateCharges()}
    `);
  }

  setSmoker(value: string) {
    this.applyForm.get('smoker')!.setValue(value);
  }

  calculateCharges() {
    let charges: number = 1000;
    let age = this.applyForm.value.age * 50;
    let bmi = this.applyForm.value.bmi * 20;
    let numOfChildren = this.applyForm.value.numOfChildren * 200;
    let smoker = this.applyForm.value.smoker === 'yes' ? 500 : 0;

    charges += age + bmi + numOfChildren + smoker;
    return charges;
  }
}
