import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SexService {
  private apiUrl = 'http://localhost:3000/insurance/sex';
  constructor(private http:HttpClient) { }
  getSexData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
