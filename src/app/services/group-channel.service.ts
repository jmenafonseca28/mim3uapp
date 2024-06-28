import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GroupChannelService {
  private apiUrl = 'https://tu-api-url.com/api/groupchannels';

  constructor(private http: HttpClient) { }

  getGroupChannels(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getGroupChannel(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createGroupChannel(groupChannel: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupChannel);
  }

  updateGroupChannel(id: number, groupChannel: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, groupChannel);
  }

  deleteGroupChannel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
