import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, RouterLink]

})
export class AppComponent implements OnInit {

  isLogged = false;

  constructor(private storage: Storage, private router: Router) { }

  async ngOnInit() {
    await this.storage.create();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });
  }

  async checkLoginStatus() {
    if (await this.storage.get('user') !== null) {
      this.isLogged = true;
    } else {
      const path = window.location.pathname;
      this.isLogged = false;
      if (path !== '/register' && path !== '/login') this.router.navigate(['/login']);
    }
    this.updateMenuState();
  }

  updateMenuState() {
    const menu = document.getElementById("menu") as HTMLInputElement;
    menu && (menu.disabled = !this.isLogged);
  }

  logout() {
    this.storage.remove('user');
    this.isLogged = false;
    this.router.navigate(['/login']);
  }

}
