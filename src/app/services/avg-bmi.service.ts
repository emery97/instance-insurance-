import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvgBmiService {
  private apiUrl = 'http://localhost:3000/insurance/avg-bmi';
  constructor(private Http: HttpClient) { }
  getAvgBmiData(): Observable<any> {
    return this.Http.get(this.apiUrl);
  }
}
