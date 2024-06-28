import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { User } from '../models/IUser.model';
import { Group } from '../models/IGroup.model';
import { Storage } from '@ionic/storage';
import { CreateGroupsComponent } from '../components/groups/create-groups/create-groups.component';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, codeSlashOutline, createOutline, trashOutline } from 'ionicons/icons';
import { GroupsService } from '../services/groups.service';
import { EditGroupsComponent } from '../components/groups/edit-groups/edit-groups.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]
})
export class GroupPage implements OnInit {

  popover: HTMLIonPopoverElement = {} as HTMLIonPopoverElement;
  user: User = {} as User;
  isAlertOpen = false;
  errorMessage: string = '';
  groups: Group[] = [];
  isOpenToast = false;
  messageToast = '';
  playListId: string = '';

  alertButtons = [
    {
      text: 'Ok',
      handler: () => {
        this.router.navigate(['/login']);
        this.storage.clear();
      }
    }
  ];

  constructor(private storage: Storage, private router: Router,
    private popoverController: PopoverController, private groupService: GroupsService, private aRoute: ActivatedRoute) {
    addIcons({ addOutline, createOutline, trashOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
      this.aRoute.params.subscribe((params) => {
        this.playListId = params['id'];
        this.getGroups();
      });
    });

  }

  getGroups() {
    if (!this.user.token || !this.playListId) return;

    this.groupService.getAllGroups(this.playListId, this.user.token).subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.groups = response.data;
        } else {
          this.errorMessage = response.message;
          this.setOpen(true);
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.setOpen(true);
      }
    });
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  async presentPopoverToAddGroup() {
    this.popover = await this.popoverController.create({
      component: CreateGroupsComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true,
    });
    this.popover.componentProps = {
      playListId: this.playListId
    };
    this.popover.onDidDismiss().then(() => {
      this.getGroups();
      this.messageToast = 'Grupo creado con éxito';
      this.isOpenToast = true;
    });
    return await this.popover.present();
  }

  deleteGroup(id: string) {
    if (!this.user.token || !id) return;

    this.groupService.deleteGroup(id, this.user.token).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage = response.message;
          this.setOpen(true);
          return;
        }

        this.messageToast = 'Grupo eliminado con éxito';
        this.isOpenToast = true;
        this.getGroups();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.setOpen(true);
      }
    });
  }

  toggleToast() {
    this.isOpenToast = !this.isOpenToast;
  }

  async presentPopoverToEditGroup(selectedGroups: Group) {
    this.popover = await this.popoverController.create({
      component: EditGroupsComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true,
    });
    this.popover.componentProps = {
      group: selectedGroups
    };
    this.popover.onDidDismiss().then(() => {
      this.getGroups();
      this.messageToast = 'Grupo actualizado con éxito';
      this.isOpenToast = true;
      console.log('Grupo creado con éxito');
    });
    return await this.popover.present();
  }

  onComeBack() {
    this.router.navigate(['/channel/' + this.playListId]);
  }

}
