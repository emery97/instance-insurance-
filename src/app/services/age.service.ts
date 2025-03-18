import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgeService {
  private apiUrl = 'http://localhost:3000/insurance/age';
  constructor(private http:HttpClient) { }
  getAgeData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
