import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TokenService } from "../../services/token.service";
import { AuthService } from "../../services/auth.service";

interface User {
  roles: string[];
  email: string;
  username: string;
}

@Component({
  standalone: true,
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  loggedIn: boolean = true;
  user: User = {
    roles: [],
    email: '',
    username: ''
  };

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.user = {
        roles: [decodedToken.role],
        email: decodedToken.email,
        username: decodedToken.username || 'User'
      };
    }
  }

  getDashboardRoute(): string {
    if (this.user.roles.includes('ADMIN')) {
      return '/dashboard-admin';
    }
    if (this.user.roles.includes('STUDENT')) {
      return '/dashboard-student';
    }
    if (this.user.roles.includes('LECTURER')) {
      return '/dashboard-lecturer';
    }
    if (this.user.roles.includes('FACULTY')) {
      return '/dashboard-faculty';
    }
    return '/404';
  }

  handleLogout() {
    const userId = this.tokenService.getDecodedToken()?.uid;

    const clearAndRedirect = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    };

    if (userId) {
      this.authService.logout(userId).subscribe({
        next: () => clearAndRedirect(),
        error: () => clearAndRedirect()
      });
    } else {
      clearAndRedirect();
    }
  }
}
