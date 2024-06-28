import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Channel } from 'src/app/models/IChannel.model';
import { User } from 'src/app/models/IUser.model';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { ChannelService } from 'src/app/services/channel.service';
import { SuccessMessages } from 'src/app/Utils/SuccessMessages';
import { ErrorMessages } from 'src/app/Utils/ErrorMessages';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class EditChannelComponent implements OnInit {

  channel: Channel = {} as Channel;
  user: User = {} as User;

  isAlertOpen = false;
  errorMessage: string = '';
  alertButtons = ['Ok'];

  isOpenToast = false;
  messageToast = '';

  constructor(private popoverController: PopoverController, private storage: Storage, private channelService: ChannelService) {
    addIcons({ alertCircleOutline });
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
    });
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  onSubmit() {

    if (!this.user.token || !this.channel.id) {
      this.errorMessage = 'Error, intente nuevamente';
      this.setOpen(true);
      return;
    };

    if (!this.channel.title || !this.channel.url) {
      this.errorMessage = ErrorMessages.EMPTY_FIELDS;
      this.setOpen(true);
      return;
    };

    this.channelService.updateChannel(this.channel, this.user.token).subscribe({
      next: (response) => {
        this.isOpenToast = true;
        this.messageToast = SuccessMessages.CHANNEL_UPDATED;
        this.closePopover();
      },
      error: (error) => {
        this.errorMessage = ErrorMessages.HttpErrorResponse;
        this.setOpen(true);
      }
    });

  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  toggleToast() {
    this.isOpenToast = !this.isOpenToast;
  }
}
