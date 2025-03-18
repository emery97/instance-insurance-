import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BmiService {
  private apiUrl = 'http://localhost:3000/insurance/bmi';
  constructor(private http:HttpClient) { }
  getBmiData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
