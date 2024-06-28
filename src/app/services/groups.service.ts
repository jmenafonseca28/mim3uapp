import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../Config/ConfigService';
import { ResponseApi } from '../models/IResponseApi.model';
import { Group } from '../models/IGroup.model';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private API_URL = this.configService.buildApiUrl('Groups');

  private httpHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ''
    },
    responseType: 'json'
  };

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getAllGroups(playListId: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.get<ResponseApi>(`${this.API_URL}/GetGroupsByPlayListId/${playListId}`, { headers: this.httpHeaders.headers });
  }

  createGroup(group: Group, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.post<ResponseApi>(`${this.API_URL}/CreateGroup`, group, { headers: this.httpHeaders.headers });
  }

  deleteGroup(id: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.delete<ResponseApi>(`${this.API_URL}/DeleteGroup/${id}`, { headers: this.httpHeaders.headers });
  }

  updateGroup(group: Group, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.put<ResponseApi>(`${this.API_URL}/UpdateGroup/`, group, { headers: this.httpHeaders.headers });
  }

  changeGroup(idChannel: string, group: Group, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.put<ResponseApi>(`${this.API_URL}/ChangeGroup/${idChannel}`, group, { headers: this.httpHeaders.headers });
  }

  /*getGroupById(id: string, token: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.API_URL}/getById/${id}`, { headers: this.httpHeaders.headers });
  }*/

}
