import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../Config/ConfigService';
import { ResponseApi } from '../models/IResponseApi.model';
import { Playlist } from '../models/IPlaylist.model';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private API_URL = this.configService.buildApiUrl('PlayList');

  private httpHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ''
    },
    responseType: 'json'
  };

  constructor(private http: HttpClient, private configService: ConfigService) { }

  //para obtener todas las listas de reproducción de un usuario
  getAllPlaylists(userId: string, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.get<ResponseApi>(`${this.API_URL}/getPlayListsByUserId/${userId}`, { headers: this.httpHeaders.headers });
  }

  //para obtener una lista de reproducción por su ID
  getPlaylistById(id: string, token: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.API_URL}/getById/${id}`, { headers: this.httpHeaders.headers });
  }

  //para crear una nueva lista de reproducción
  createPlaylist(playlistData: Playlist, token: string): Observable<ResponseApi> {
    const name = playlistData.name;
    const userId = playlistData.user_Id;
    return this.http.post<ResponseApi>(`${this.API_URL}/createPlayList`, { name, userId }, { headers: this.httpHeaders.headers });
  }

  //para eliminar una lista de reproducción
  deletePlaylist(id: string, token: string): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.API_URL}/deletePlayList/${id}`, { headers: this.httpHeaders.headers });
  }

  //para actualizar 
  updatePlaylist(playlistData: Playlist, token: string): Observable<ResponseApi> {
    this.httpHeaders.headers['Authorization'] = `Bearer ${token}`;
    return this.http.put<ResponseApi>(`${this.API_URL}/updatePlayList/`, playlistData, { headers: this.httpHeaders.headers });
  }

}
