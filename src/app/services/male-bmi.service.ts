import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaleBmiService {
  private privateUrl = 'http://localhost:3000/insurance/male-bmi';

  constructor(private Http:HttpClient) { }

  getMaleBmiData(): Observable<any> {
    return this.Http.get(this.privateUrl);
  }
}
