import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsuranceTableComponent } from '../insurance-table/insurance-table.component';
import { SmokerButtonValueAccessorDirective } from '../smoker-button-value-accessor-directive';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom Validator for Negative or Null Values
export function nonNegativeChildrenValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value < 0) {
      return { negativeOrNullChildren: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    InsuranceTableComponent,
    SmokerButtonValueAccessorDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './landing-page.component.html', // Use the external HTML file
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  applyForm: FormGroup;

  constructor() {
    this.applyForm = new FormGroup({
      age: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      sex: new FormControl('male'), // Set 'female' as the default value
      bmi: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      numOfChildren: new FormControl('', [nonNegativeChildrenValidator()]),
      smoker: new FormControl(''),
      region: new FormControl(''),
    });
  }

  ngOnInit() {
    const numOfChildrenControl = this.applyForm.get('numOfChildren');

    // Listen for changes to numOfChildren and update validation
    numOfChildrenControl?.valueChanges.subscribe((value) => {
      // Reset all errors first
      numOfChildrenControl?.setErrors(null);

      // Check for negative or null value
      if (value === null || value < 0) {
        numOfChildrenControl?.setErrors({ negativeOrNullChildren: true });
      }

      // Check if number of children exceeds the limit
      if (value > 100) {
        numOfChildrenControl?.setErrors({ tooHighChildren: true });
        
        // Trigger Bootstrap alert for too high number of children
        this.showTooHighChildrenAlert(value);
      } else {
        // Remove alert if value goes back below the threshold
        this.hideTooHighChildrenAlert();
      }
    });
  }

  showTooHighChildrenAlert(value: number): void {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Warning!</strong> The number of children (${value}) is too high.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    }
  }

  hideTooHighChildrenAlert(): void {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.innerHTML = ''; // Clear the alert
    }
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
