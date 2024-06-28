
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Storage } from '@ionic/storage';
import { UserBase } from '../models/IUserBase.model';
import { addIcons } from 'ionicons';
import { personAddSharp, personSharp } from 'ionicons/icons';//SE IMPORTAN LOS ICONOS QUE SE VAN A USAR

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]

})
export class LoginPage {

  user: UserBase = { email: '', password: '' };

  alertButtons = ['ok'];

  isAlertOpen = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private storage: Storage,
    private router: Router,
  ) {
    addIcons({ personSharp, personAddSharp });//PRIMERO SE AÑADEN LOS ICONOS QUE SE VAN A USAR
  }



  register() {
    this.router.navigate(['/register']);
  }

  async login() {

    if (!this.validateInputs()) {
      this.errorMessage = 'Por favor, rellene todos los campos';
      this.setOpen(true);
      return;
    }

    const loadingIndicator = await this.showLoadingIndicator();

    this.authService.login(this.user).subscribe({
      //Si todo sale bien
      next: async (response) => {
        if (response.success) {
          await this.storage.set('user', response.data);
          this.router.navigate(['/homepage']);
        } else {
          this.errorMessage = response.message;
          this.setOpen(true);

        }
      },
      //Si hay un error
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      },

    });
    loadingIndicator.dismiss();
  }

  private validateInputs() {
    return this.user.email.length > 0 && this.user.password.length > 0;
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  private async showLoadingIndicator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
}
