import { Component } from "@angular/core";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [SidebarComponent, RouterModule, CommonModule, HttpClientModule],
})
export class AppComponent {
  showSidebar: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !["/login", "/"].includes(event.url);
        
        if (event.url === '/') {
          const token = localStorage.getItem('token');
          if (token) {
            const defaultRoute = this.authService.getDefaultRoute();
            this.router.navigate([defaultRoute]);
          } else {
            this.router.navigate(['/login']);
          }
        }
        
        if (!localStorage.getItem('token') && event.url !== "/login") {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
