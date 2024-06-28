import { PlaylistService } from 'src/app/services/playlist.service';
import { Playlist } from 'src/app/models/IPlaylist.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { User } from 'src/app/models/IUser.model';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]
})
export class CreatePlaylistComponent implements OnInit {

  playlist: Playlist = {
    name: '',
    user_Id: '',
  };

  user: User = {
    id: '',
    name: '',
    lastName: '',
    email: '',
    password: ''
  };

  alertButtons = [
    {
      text: 'Ok',
      handler: () => {
        this.router.navigate(['/login']);
        this.storage.clear();
      }
    }
  ];

  isAlertOpen = false;
  errorMessage: string = '';

  constructor(private playlistService: PlaylistService, private storage: Storage,
    private popoverController: PopoverController, private router: Router) { }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  ngOnInit(): void {
    this.storage.get('user').then((user) => {
      this.user = user;
      this.playlist.user_Id = user.id;
    });
  }


  onSubmit() {
    if (!this.user.token) return;

    this.playlistService.createPlaylist(this.playlist, this.user.token).subscribe({
      next: (response) => {
        this.closePopover();
      },
      error: (error) => {
        this.closePopover();
        this.errorMessage = error.message;
        this.setOpen(true);
      }
    });
  }

  closePopover() {
    this.popoverController.dismiss();
  }

}
