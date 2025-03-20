import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FemaleBmiService {
  private privateApiUrl = 'http://localhost:3000/insurance/female-bmi';
  constructor(private Http:HttpClient) { }
  getFemaleBmiData(): Observable<any> {
    return this.Http.get(this.privateApiUrl);
  }
}
