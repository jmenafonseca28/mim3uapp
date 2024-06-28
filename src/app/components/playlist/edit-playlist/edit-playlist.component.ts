import { PlaylistService } from 'src/app/services/playlist.service';
import { Playlist } from 'src/app/models/IPlaylist.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from 'src/app/models/IUser.model';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]
})
export class EditPlaylistComponent implements OnInit {

  playlist: Playlist = {
    id: '',
    user_Id: '',
    name: ''
  };
  user: User = {} as User;


  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
    });
  }

  constructor(private popoverController: PopoverController, private playlistService: PlaylistService, private storage: Storage) { }


  saveChanges() {
    if (!this.playlist.id || !this.user.token) return;


    this.playlistService.updatePlaylist(this.playlist, this.user.token).subscribe({
      next: (response) => {
        this.closePopover(); // Cierra el popover después de actualizar la playlist

      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  closePopover() {
    this.popoverController.dismiss();
  }
}
