import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userNameControl = new FormControl('', [Validators.required]);
  roomControl = new FormControl('', [Validators.required]);
  router = inject(Router);


  goToRoom() {
    if (this.roomControl.invalid || this.userNameControl.invalid) {
      if (this.roomControl.invalid) this.roomControl.markAsTouched();
      if (this.userNameControl.invalid) this.userNameControl.markAsTouched();
      return;
    }

    const userName = this.userNameControl.value;
    if (userName) {
      localStorage.setItem('username', userName.trim());
    }

    this.router.navigate(['/chat', this.roomControl.value ?? '']);
  }
}
