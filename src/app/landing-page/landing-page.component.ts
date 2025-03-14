import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InsuranceTableComponent } from '../insurance-table/insurance-table.component';
import { SmokerButtonValueAccessorDirective } from '../smoker-button-value-accessor-directive';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    InsuranceTableComponent,
    SmokerButtonValueAccessorDirective,
    MatFormFieldModule,
    MatInputModule,
    InsuranceTableComponent,
    ReactiveFormsModule,
    MatSelectModule,
    SmokerButtonValueAccessorDirective,
  ],
  template: `
    <h1>Insurance Application</h1>
    <section>
      <form
        #myForm="ngForm"
        [formGroup]="applyForm"
        (submit)="submitApplication()"
      >
        <!-- Age Form Group -->
        <div class="form-group">
          <label for="age"> Age </label>
          <input id="age" type="number" formControlName="age" name="age" />
        </div>

        <!-- Sex Form Group -->
        <div class="sex-form-group">
          <label for="sex"> Sex </label>
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
            <label class="form-check-label" for="femaleRadio"> Female </label>
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
            <label class="form-check-label" for="maleRadio"> Male </label>
          </div>
        </div>

        <!-- BMI Form Group -->
        <div class="form-group">
          <label for="bmi"> BMI </label>
          <input id="bmi" type="number" formControlName="bmi" name="bmi" />
        </div>

        <button type="button" class="btn btn-primary">Primary</button>
        
        <!-- Number of Children Form Group -->
        <div class="form-group">
          <label for="numOfChildren"> Number of Children </label>
          <input
            id="numOfChildren"
            type="number"
            formControlName="numOfChildren"
            name="numOfChildren"
          />
        </div>

        <!-- Smoker Form Group -->
        <div class="smoker-form-group">
          <label for="smoker"> Smoker </label>
          <div class="smoker-button-container">
            <div class="form-group">
              <div class="smoker-button-container">
                <button
                  type="button"
                  class="smoker-button"
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
          </div>
        </div>

        <!-- Region Form Group -->
        <div class="form-group">
          <mat-form-field>
            <mat-label>Region</mat-label>
            <mat-select formControlName="region">
              <mat-option> None </mat-option>
              <mat-option value="north"> North</mat-option>
              <mat-option value="northeast"> North - East</mat-option>
              <mat-option value="northwest"> North - West</mat-option>
              <mat-option value="south"> South</mat-option>
              <mat-option value="southeast"> South - East</mat-option>
              <mat-option value="southwest"> South - West</mat-option>
              <mat-option value="central"> Central</mat-option>
              <mat-option value="east"> East</mat-option>
              <mat-option value="west"> West</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Submit Button -->
        <button class="primary" type="submit" [disabled]="applyForm.invalid">
          Send
        </button>
      </form>
    </section>

    <div>
      <app-insurance-table></app-insurance-table>
    </div>
  `,
  styleUrl: '',
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
  
  calculateCharges(){
    let charges: number = 1000;
    let age = this.applyForm.value.age * 50;
    let bmi = this.applyForm.value.bmi * 20;
    let numOfChildren = this.applyForm.value.numOfChildren * 200;
    let smoker = this.applyForm.value.smoker === 'yes' ? 500 : 0;

    charges += age + bmi + numOfChildren + smoker;
    return charges;
  }
}
