import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PlaylistService } from '../services/playlist.service';
import { Playlist } from '../models/IPlaylist.model';
import { Storage } from '@ionic/storage';

import { addIcons } from 'ionicons';
import { add, lockClosedOutline } from 'ionicons/icons';

import { CreatePlaylistComponent } from '../components/playlist/create-playlist/create-playlist.component';
import { EditPlaylistComponent } from '../components/playlist/edit-playlist/edit-playlist.component';
import { PopoverController } from '@ionic/angular';
import { User } from '../models/IUser.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]

})
export class PlaylistPage implements OnInit {

  popover: HTMLIonPopoverElement = {} as HTMLIonPopoverElement;
  playlistsList: Playlist[] = [];
  user: User = { id: '', name: '', lastName: '', email: '', password: '' };
  alertButtons = [{ text: 'Ok' }];

  playListToDelete: Playlist = { id: '', name: '', user_Id: '' };

  deletePlaylistButtons = [
    {
      text: 'Si',
      handler: () => {
        this.confirmDeletePlaylist();
        this.setDeletePlaylistOpen(false);
      }
    },
    {
      text: 'No',
      handler: () => {
        this.setDeletePlaylistOpen(false);
        this.playListToDelete = { id: '', name: '', user_Id: '' };
      }
    }
  ];

  isDeletePlaylistOpen = false;

  isAlertOpen = false;

  errorMessage: string = '';

  constructor(private router: Router, private playlistService: PlaylistService
    , private popoverController: PopoverController, private storage: Storage) {
    addIcons({ lockClosedOutline, add });
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  setDeletePlaylistOpen(isOpen: boolean) {
    this.isDeletePlaylistOpen = isOpen;
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
      this.loadPlaylists(); // Cargar las listas de reproducción al inicializar el componente
    });
  }

  loadPlaylists() {
    if (!this.user.id || !this.user.token) return;

    this.playlistService.getAllPlaylists(this.user.id, this.user.token).subscribe((response) => {
      this.playlistsList = response.data;
      if (this.playlistsList && this.playlistsList.length === 0) {
        this.errorMessage = 'No se encontraron listas de reproducción';
        this.setOpen(true);
      }
    });
  }

  trackById(index: number, item: Playlist): string {
    return item.id ?? ""; // Devuelve el identificador único del elemento
  }

  selectPlaylist(playlist: Playlist) {
    this.router.navigate(['/channel/' + playlist.id]);
  }

  deletePlaylist(playlist: Playlist) {

    this.playListToDelete = playlist;
    this.setDeletePlaylistOpen(true);

  }

  confirmDeletePlaylist() {
    if (!this.playListToDelete.id || !this.user.token) return;

    this.playlistService.deletePlaylist(this.playListToDelete.id, this.user.token).subscribe(() => {
      this.playListToDelete = { id: '', name: '', user_Id: '' };
      this.loadPlaylists();
    });
  }

  async presentCreatePlaylistPopover() {
    this.popover = await this.popoverController.create({
      component: CreatePlaylistComponent,
      translucent: true,
      backdropDismiss: true, 
    });
    this.popover.onDidDismiss().then(() => {
      this.loadPlaylists();
    });
    return await this.popover.present();
  }

  async presentEditPlaylistPopover(playlist: Playlist) {
    this.popover = await this.popoverController.create({
      component: EditPlaylistComponent,
      componentProps: {
        playlist: playlist
      },
      translucent: true,
      backdropDismiss: true,
    });
    this.popover.onDidDismiss().then(() => {
      this.loadPlaylists();
    });
    return await this.popover.present();
  }

}
