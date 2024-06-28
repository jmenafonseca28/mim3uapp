import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/models/IGroup.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from 'src/app/models/IUser.model';

@Component({
  selector: 'app-edit-groups',
  templateUrl: './edit-groups.component.html',
  styleUrls: ['./edit-groups.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule]
})
export class EditGroupsComponent implements OnInit {

  group: Group = {
    id: '',
    name: ''
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

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
    });
  }

  constructor(private popoverController: PopoverController,
    private groupService: GroupsService, private storage: Storage, private router: Router) { }


  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  onSubmit() {
    if (!this.user.token) return;

    this.groupService.updateGroup(this.group, this.user.token).subscribe({
      next: (response) => {
        console.log(response);
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
