import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ItemReorderEventDetail, PopoverController } from '@ionic/angular';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Channel } from '../models/IChannel.model';
import { ChannelService } from '../services/channel.service';
import { PlaylistService } from '../services/playlist.service';
import { Storage } from '@ionic/storage';
import { User } from '../models/IUser.model';
import { addIcons } from 'ionicons';
import { addCircleOutline, chevronUpCircle, cloudUploadOutline, downloadOutline, reorderFourOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { CreateChannelComponent } from '../components/channel/create-channel/create-channel.component';

//filtro
import { GroupChannelService } from '../services/group-channel.service';
import { GroupsService } from '../services/groups.service';
import { Group } from '../models/IGroup.model';
import { CreateGroupsComponent } from '../components/groups/create-groups/create-groups.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.page.html',
  styleUrls: ['./channel.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]
})
export class ChannelPage implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;

  popover: HTMLIonPopoverElement = {} as HTMLIonPopoverElement;
  channels: Channel[] = [];
  
  groups: Group[] = [];
  filteredChannels: Channel[] = [];
  selectedGroups: string[] = [];

  playListId: string = '';
  user: User = {} as User;
  isDisabled = true;
  isOpenToast = false;
  messageToast = '';
  isCharging = true;
  isDeleting = false;

  colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
  currentColorIndex = 0;

  alertDeleteButtons = [
    {
      text: 'Si',
      handler: () => {
        this.deleteChannel();
        this.isDeletingAlert = false;
      }
    },
    {
      text: 'No',
      handler: () => {
        this.isDeletingAlert = false;
        this.channelToDelete = {} as Channel;
      }
    }
  ];
  isDeletingAlert = false;
  channelToDelete: Channel = {} as Channel;

  constructor(private channelService: ChannelService, private playListService: PlaylistService,
    private aRoute: ActivatedRoute, private storage: Storage, private router: Router, private popoverController: PopoverController, private groupChannelService: GroupChannelService,
    private groupService: GroupsService) {
    addIcons({
      chevronUpCircle,
      saveOutline,
      reorderFourOutline,
      downloadOutline,
      addCircleOutline,
      trashOutline,
      cloudUploadOutline
    });
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
      this.aRoute.params.subscribe((params) => {
        this.playListId = params['id'];
        this.loadChannels();
        this.loadGroups();
      });
    });
  }

  loadChannels() {
    if (!this.playListId || !this.user.token) return;

    this.channelService.getAllChannels(this.playListId, this.user.token).subscribe({
      next: (response) => {
        console.log(response);
        this.channels = response.data;
        this.channels.sort((a, b) => (a.orderList ?? 0) - (b.orderList ?? 0));
        this.isCharging = false;
        this.filterChannels(); 
      },
      error: (error) => {
        console.log(error);
        this.isCharging = false;
        this.messageToast = 'Error al cargar los canales';
        this.isOpenToast = true;
      }

    });
  }

  downloadPlayList() {
    if (!this.playListId || !this.user.token) return;

    this.channelService.downloadPlayList(this.playListId, this.user.token).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'text/m3u' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().getTime().toString().substring(0, 6);

      link.href = url;
      link.download = `Playlist${date}.m3u`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    });
  }

  openChannel(channel: Channel) {
    channel.playlistId = this.playListId;
    this.storage.set('channel', channel);
    this.router.navigate(['channel-view']);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const draggedItem = this.channels.splice(ev.detail.from, 1)[0];
    this.channels.splice(ev.detail.to, 0, draggedItem);
    ev.detail.complete();
  }

  saveOrder() {
    this.channels.forEach((channel, index) => {
      if (!this.user.token || !channel.id) return;

      this.channelService.toggleOrderList(channel.id, index + 1, this.user.token).subscribe(() => {
        this.isOpenToast = true;
        this.messageToast = 'Orden guardado con éxito';
      });
    });
    this.toggleReorder();
  }

  toggleReorder() {
    this.isDisabled = !this.isDisabled;
    if (!this.isDisabled) {
      this.messageToast = 'Debes guardar el orden para que se aplique';
      this.isOpenToast = true;
    }
  }

  toggleToast() {
    this.isOpenToast = !this.isOpenToast;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadChannels();
      event.target.complete();
    }, 2000);
  }

  async presentPopover() {
    this.popover = await this.popoverController.create({
      component: CreateChannelComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true,
    });
    this.popover.componentProps = { playlistId: this.playListId };
    this.popover.onDidDismiss().then(() => {
      this.loadChannels();
    });
    return await this.popover.present();
  }

  deleteChannel() {
    if (!this.user.token || !this.channelToDelete || !this.channelToDelete.id) return;

    this.channelService.deleteChannel(this.channelToDelete.id, this.user.token).subscribe(() => {
      this.isDeleting = false;
      this.loadChannels();
    });
  }

  setChannelToDelete(channel: Channel) {
    this.channelToDelete = channel;
    this.isDeletingAlert = true;
  }

  toggleDelete() {
    this.isDeleting = !this.isDeleting;
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    if (!event.target.files || event.target.files.length === 0 || !this.playListId || !this.user.token) return;

    const file: File = event.target.files[0];
    if (!file || file.type !== 'audio/x-mpegurl' || !file.name.endsWith('.m3u')) return;
    console.log(file);

    this.isCharging = true;
    this.changeColors();

    this.channelService.importChannels(file, this.playListId, this.user.token).then((response) => {
      console.log(response);
      this.loadChannels();
      this.isCharging = false;
      this.isOpenToast = true;
      this.messageToast = 'Canales importados con éxito';
    }).catch((error) => {
      console.log(error);
      this.isOpenToast = true;
      this.isCharging = false;
      this.messageToast = 'Error al importar los canales';
    });

  }

  async changeColors() {
    for (let i = 0; i < 10; i++) {
      this.changeColor();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  changeColor() {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
  }

  loadGroups(): void {
    if (!this.playListId || !this.user.token) return;

    this.groupService.getAllGroups(this.playListId, this.user.token).subscribe((response) => {
      this.groups = response.data;
      
    });
  }

  filterChannels(): void {
    if (this.selectedGroups.length > 0) {
      this.filteredChannels = this.channels.filter(channel =>
        this.selectedGroups.includes(channel.groupTitle || '')
      );
    } else {
      console.log("Sin filtros");
      this.filteredChannels = this.channels;
    }
  }


}
