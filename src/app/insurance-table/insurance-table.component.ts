import { Component, OnInit } from '@angular/core';
import { InsuranceDatabaseService } from '../services/insurance-database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance-table',
  templateUrl: './insurance-table.component.html',
  imports: [CommonModule],
  styleUrls: ['./insurance-table.component.css'],
})
export class InsuranceTableComponent implements OnInit {
  insuranceData: any[] = [];

  constructor(private insuranceDatabaseService: InsuranceDatabaseService) {}

  ngOnInit(): void {
    this.insuranceDatabaseService.getInsuranceData().subscribe(
      data => {
        this.insuranceData = data;
      },
      error => {
        console.error('Error fetching insurance data', error);
      }
    );
  }
}