import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuranceDatabaseService {
  private apiUrl = 'http://localhost:3000/insurance/data';

  constructor(private http:HttpClient) { }

  getInsuranceData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
