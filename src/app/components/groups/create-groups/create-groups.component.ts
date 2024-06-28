import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/models/IGroup.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { User } from 'src/app/models/IUser.model';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-create-groups',
  templateUrl: './create-groups.component.html',
  styleUrls: ['./create-groups.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]
})
export class CreateGroupsComponent implements OnInit {

  playListId: string = '';

  group: Group = {
    name: '',
    idPlaylist: ''
  };

  user: User = {} as User;

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

  constructor(private groupService: GroupsService, private storage: Storage,
    private popoverController: PopoverController, private router: Router) { }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  ngOnInit(): void {
    this.storage.get('user').then((user) => {
      this.user = user;
    });
  }


  onSubmit() {
    if (!this.user.token) return;

    this.group.idPlaylist = this.playListId;

    this.groupService.createGroup(this.group, this.user.token).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage = response.message;
          this.setOpen(true);
        }
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
