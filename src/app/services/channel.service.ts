import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../Config/ConfigService';
import { ResponseApi } from '../models/IResponseApi.model';
import { Channel } from '../models/IChannel.model';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private API_URL = this.configService.buildApiUrl('Channel');
  private SUB_API_URL = this.configService.buildApiUrl('PlayList');

  private httpHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ''
    },
    responseType: 'json'
  };

  constructor(private http: HttpClient, private configService: ConfigService) { }

  /* updateFunctionalChannels(playListId: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.get<ResponseApi>(`${this.API_URL}/FunctionalChannels/${playListId}/`, { headers: this.httpHeaders.headers });
  } */

  toggleOrderList(channelId: string, orderList: number, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.patch<ResponseApi>(`${this.API_URL}/ToggleOrder/${channelId}/${orderList}/`, null, { headers: this.httpHeaders.headers });
  }

  getAllChannels(playListId: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.get<ResponseApi>(`${this.API_URL}/GetChannelsByPlaylist/${playListId}/`, { headers: this.httpHeaders.headers });
  }

  downloadPlayList(playListId: string, token: string): Observable<any> {
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    }
    return this.http.get(`${this.SUB_API_URL}/exportPlayList/${playListId}/`, { responseType: 'blob', headers: headers.headers });
  }

  importChannels(file: File, playListId: string, token: string): Promise<Response> {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const formData = new FormData();
    formData.append("file", file);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData
    };

    return fetch(`${this.API_URL}/ImportChannels/${playListId}`, requestOptions);
  }

  getChannelById(channelId: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.get<ResponseApi>(`${this.API_URL}/GetChannel/${channelId}/`, { headers: this.httpHeaders.headers });
  }

  createChannel(channel: Channel, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.post<ResponseApi>(`${this.API_URL}/CreateChannel/`, channel, { headers: this.httpHeaders.headers });
  }

  updateChannel(channel: Channel, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.put<ResponseApi>(`${this.API_URL}/UpdateChannel/`, channel, { headers: this.httpHeaders.headers });
  }

  deleteChannel(channelId: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.delete<ResponseApi>(`${this.API_URL}/DeleteChannel/${channelId}/`, { headers: this.httpHeaders.headers });
  }
}
