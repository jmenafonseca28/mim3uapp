import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBase } from '../models/IUserBase.model';
import { User } from '../models/IUser.model';
import { ConfigService } from '../Config/ConfigService';
import { ResponseApi } from '../models/IResponseApi.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = this.configService.buildApiUrl('Userr');

  private httpHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    responseType: 'json'
  };

  constructor(private http: HttpClient, private configService: ConfigService) { }

  login(user: UserBase): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.API_URL}/login`, user, { headers: this.httpHeaders.headers });
  }

  register(user: User): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.API_URL}/register`, user, { headers: this.httpHeaders.headers });
  }

}
