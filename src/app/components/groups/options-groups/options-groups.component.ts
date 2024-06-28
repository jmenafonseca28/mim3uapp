import { Component, OnInit } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from 'src/app/models/IUser.model';
import { Group } from 'src/app/models/IGroup.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options-groups',
  templateUrl: './options-groups.component.html',
  styleUrls: ['./options-groups.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class DeleteOptionsComponent  implements OnInit {

  user: User = {} as User;
  isAlertOpen = false;
  errorMessage: string = '';
  groupId: string = '';
  groups: Group[] = [];

  
  alertButtons = [
    {
      text: 'Ok',
      handler: () => {
        this.router.navigate(['/login']);
        this.storage.clear();
      }
    }
  ];

  constructor(private storage: Storage, private popoverController: PopoverController,
     private groupService: GroupsService, private router: Router) { }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      this.user = user;
    });
  }


  onSubmit() {
    if (!this.user.token || !this.groupId) return;

    this.groupService.deleteGroup(this.groupId, this.user.token).subscribe({
      next: (response) => {
        if(!response.success) {
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

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

}
