import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Channel } from 'src/app/models/IChannel.model';
import { FormsModule } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ChannelService } from 'src/app/services/channel.service';
import { ErrorMessages } from 'src/app/Utils/ErrorMessages';
import { User } from 'src/app/models/IUser.model';
import { Storage } from '@ionic/storage';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class CreateChannelComponent implements OnInit {

  channel: Channel = {} as Channel;
  user: User = {} as User;
  playlistId: string = '';

  isAlertOpen = false;
  errorMessage: string = '';
  alertButtons = ['Ok'];

  constructor(
    private popoverController: PopoverController, private channelService: ChannelService,
    private storage: Storage
  ) {
    addIcons({ alertCircleOutline });
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
    });

    this.channel.playlistId = this.playlistId;

  }

  onSubmit() {

    if (!this.user.token || !this.channel.playlistId) {
      this.errorMessage = ErrorMessages.TRY_AGAIN;
      this.setOpen(true);
      return;
    };

    if (!this.channel.title || !this.channel.url) {
      this.errorMessage = ErrorMessages.EMPTY_FIELDS;
      this.setOpen(true);
      return;
    }

    this.channel.tvgId = this.channel.tvgName;

    this.channelService.createChannel(this.channel, this.user.token).subscribe({
      next: (response) => {
        console.log(response);
        this.closePopover();
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = ErrorMessages[error.name as keyof typeof ErrorMessages] || ErrorMessages.Default;
        this.setOpen(true);
      }
    });
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
