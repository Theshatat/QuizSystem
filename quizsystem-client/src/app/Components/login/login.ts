// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../Services/HttpService/http-client-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userName = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private authService: HttpClientService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    this.authService.login({ userName: this.userName, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid username or password';
      }
    });
  }
}