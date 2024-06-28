import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs';
import { ResponseApi } from '../models/IResponseApi.model';
import { User } from '../models/IUser.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class RegisterPage {

  user = { name: '', lastName: '', email: '', password: '', confirmPassword: '' };

  alertButtons = ['ok'];

  isAlertOpen = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private loadingController: LoadingController, private router: Router,) { }

  async register() {

    if (!this.validateInputs()) {
      this.errorMessage = 'Por favor, rellene todos los campos';
      this.setOpen(true);
      return;
    }

    if (!this.validatePasswords()) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.setOpen(true);
      return;
    }

    const loadingIndicator = await this.showLoadingIndicator();

    this.authService.register(this.user).subscribe({
      next: async (response) => {
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message;
          this.setOpen(true);
        }
      },
      error: async (error) => {
        this.errorMessage = 'Ha ocurrido un error inesperado';
        this.setOpen(true);
      }
    });

    loadingIndicator.dismiss();

  }

  private validateInputs() {
    return this.user.email && this.user.password && this.user.name && this.user.lastName;
  }

  private validatePasswords() {
    return this.user.password === this.user.confirmPassword;
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  private async showLoadingIndicator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Registrando...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

}
