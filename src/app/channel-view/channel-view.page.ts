import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Channel } from '../models/IChannel.model';
import Hls from 'hls.js';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { EditChannelComponent } from '../components/channel/edit-channel/edit-channel.component';
import { Group } from '../models/IGroup.model';
import { User } from '../models/IUser.model';
import { GroupsService } from '../services/groups.service';

@Component({
  selector: 'app-channel-view',
  templateUrl: './channel-view.page.html',
  styleUrls: ['./channel-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChannelViewPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('video') video: ElementRef<HTMLVideoElement> = {} as ElementRef<HTMLVideoElement>;

  channel: Channel = {} as Channel;
  popover: HTMLIonPopoverElement = {} as HTMLIonPopoverElement;
  groups: Group[] = [];
  user: User = {} as User;
  playListId: string = '';
  selectedGroup: Group = {} as Group;

  constructor(private storage: Storage, private router: Router,
    private popoverController: PopoverController, private groupService: GroupsService) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.storage.get('channel').then((channel) => {
      if (channel !== this.channel) this.channel = channel;
      this.storage.get('user').then((user) => {
        this.user = user;
        this.loadGroups();
      });
    });
  }

  ngAfterViewInit() {
    this.storage.get('channel').then((channel) => {
      this.channel = channel;
      this.playChannel();
      this.loadGroups();
    });
  }

  ngOnDestroy() {
    this.offChannelView();
  }

  loadGroups(): void {
    if (!this.channel.playlistId || !this.user.token) return;

    this.groupService.getAllGroups(this.channel.playlistId, this.user.token).subscribe((response) => {
      this.groups = response.data;
    });
  }

  offChannelView() {
    this.video.nativeElement.pause();
    this.channel = {} as Channel;
  }

  playChannel() {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.channel.url);
      hls.attachMedia(this.video.nativeElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.video.nativeElement.play();
      });
    } else if (this.video.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.video.nativeElement.src = this.channel.url;
      this.video.nativeElement.addEventListener('loadedmetadata', () => {
        this.video.nativeElement.play();
      });
    }
  }

  onComeBack() {
    console.log(this.channel);
    let id = this.channel.playlistId;
    this.offChannelView();
    this.router.navigate(['/channel/' + id]);
  }

  async presentPopover() {
    this.video.nativeElement.pause();
    this.popover = await this.popoverController.create({
      component: EditChannelComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true,
    });
    this.popover.componentProps = { channel: this.channel };
    this.popover.onDidDismiss().then(() => {
      this.video.nativeElement.play();
    });
    return await this.popover.present();
  }

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev: any) {
    console.log(ev.target.value);
    this.selectedGroup = ev.target.value;
  }

  handleChangeGroup() {
    if (!this.channel.id || !this.user.token || !this.selectedGroup) return;

    this.groupService.changeGroup(this.channel.id, this.selectedGroup, this.user.token).subscribe({
      next: () => {
        console.log('Channel changed');
        this.channel = { ...this.channel, groupTitle: this.selectedGroup.name};
      },
      error: (err) => {
        console.log(err);
      }

    });
  }

}
