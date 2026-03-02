import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login-page",
  standalone: true,
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  providers: [AuthService]
})
export class LoginPageComponent {
  email: string = "";
  password: string = "";
  errorMessage: string = "";
  isSubmitting: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  validateForm(): boolean {
    if (!this.email && !this.password) {
      this.errorMessage = "Email and password are required";
      return false;
    }
    if (!this.email) {
      this.errorMessage = "Email is required";
      return false;
    }
    if (!this.password) {
      this.errorMessage = "Password is required";
      return false;
    }
    return true;
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.errorMessage = "Invalid email or password";
    } else if (error.status === 404) {
      this.errorMessage = "User not found";
    } else if (error.status === 400) {
      this.errorMessage = "Invalid input data";
    } else {
      this.errorMessage = "An unexpected error occurred. Please try again later";
    }
  }

  onSubmit() {
    this.errorMessage = "";
    
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.metaData.accessToken);
        localStorage.setItem('role', response.metaData.role);
        
        const defaultRoute = this.authService.getDefaultRoute();
        this.router.navigate([defaultRoute]);
      },
      error: (error) => {
        this.handleError(error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
