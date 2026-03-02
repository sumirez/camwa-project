import { Routes } from "@angular/router";
import { AuthRoute } from "./app/services/auth.route.service";
import { LoginPageComponent } from "./app/pages/login-page/login-page.component";
import { ProfilePageComponent } from "./app/pages/profile-page/profile-page.component";
import { ModuleViewAdminComponent } from "./app/pages/module-view-admin/module-view-admin.component";
import { ModuleViewFAComponent } from "./app/pages/module-view-fa/module-view-fa.component";
import { ModuleViewACComponent } from "./app/pages/module-view-ac/module-view-ac.component";
import { ModuleViewLecturerComponent } from "./app/pages/module-view-lecturer/module-view-lecturer.component";
import { ModuleViewStudentComponent } from "./app/pages/module-view-student/module-view-student.component";
import { ModuleDetailCreateComponent } from "./app/pages/module-detail-create/module-detail-create.component";
import { ModuleDetailModifyComponent } from "./app/pages/module-detail-modify/module-detail-modify.component";
import { ModuleDetailComponent } from "./app/pages/module-detail/module-detail.component";
import { ModuleDetailLecturerComponent } from "./app/pages/module-detail-lecturer/module-detail-lecturer.component";
import { ModuleDetailStudentComponent } from "./app/pages/module-detail-student/module-detail-student.component";
import { RequestViewAdminComponent } from "./app/pages/request-view-admin/request-view-admin.component";
import { RequestViewLecturerComponent } from "./app/pages/request-view-lecturer/request-view-lecturer.component";
import { RequestViewACComponent } from "./app/pages/request-view-ac/request-view-ac.component";
import { RequestDetailAdminComponent } from "./app/pages/request-view-admin/request-detail-admin/request-detail-admin.component";
import { AccountViewAdminComponent } from "./app/pages/account-view-admin/account-view-admin.component";
import { AccountDetailCreateAdminComponent } from "./app/pages/account-view-admin/account-detail-create-admin/account-detail-create-admin.component";
import { AccountDetailModifyAdminComponent } from "./app/pages/account-view-admin/account-detail-modify-admin/account-detail-modify-admin.component";
import { DashboardAdminComponent } from "./app/pages/dashboard-admin/dashboard-admin.component";


const routeConfig: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginPageComponent,
    title: "Login",
  },
  {
    path: "profile",
    component: ProfilePageComponent,
    title: "Profile",
    canActivate: [AuthRoute]
  },
  {
    path: "dashboard-admin",
    component: DashboardAdminComponent,
    title: "Dashboard",
    canActivate: [AuthRoute]
  },
  {
    path: "module-view-admin",
    component: ModuleViewAdminComponent,
    title: "Admin Module View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-detail-create",
    component: ModuleDetailCreateComponent,
    title: "Module Detail Create View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-detail-modify",
    component: ModuleDetailModifyComponent,
    title: "Module Detail Modify View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-detail-view",
    component: ModuleDetailComponent,
    title: "Module Detail View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-detail-lecturer-view",
    component: ModuleDetailLecturerComponent,
    title: "Module Detail View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-detail-student-view",
    component: ModuleDetailStudentComponent,
    title: "Module Detail View",
    canActivate: [AuthRoute]
  },

  {
    path: "request-view-admin",
    component: RequestViewAdminComponent,
    title: "Request View",
    canActivate: [AuthRoute]
  },
  {
    path: "request-view-admin/request-detail-admin",
    component: RequestDetailAdminComponent,
    title: "Request Detail",
    canActivate: [AuthRoute]
  },
  {
    path: "request-view-lecturer",
    component: RequestViewLecturerComponent,
    title: "Request View",
    canActivate: [AuthRoute]
  },
  {
    path: "request-view-ac",
    component: RequestViewACComponent,
    title: "Request View",
    canActivate: [AuthRoute]
  },

  {
    path: "account-view-admin",
    component: AccountViewAdminComponent,
    title: "Accounts View",
    canActivate: [AuthRoute]
  },
  {
    path: "account-view-admin/account-detail-create-admin",
    component: AccountDetailCreateAdminComponent,
    title: "Admin Account Detail Create View",
    canActivate: [AuthRoute]
  },
  {
    path: "account-view-admin/account-detail-modify-admin",
    component: AccountDetailModifyAdminComponent,
    title: "Admin Account Detail Modify View",
    canActivate: [AuthRoute]
  },
 
  {
    path: "module-view-fa",
    component: ModuleViewFAComponent,
    title: "Faculty Assistant Module View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-view-ac",
    component: ModuleViewACComponent,
    title: "Academic Coordinator Module View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-view-lecturer",
    component: ModuleViewLecturerComponent,
    title: "Lecturer Module View",
    canActivate: [AuthRoute]
  },
  {
    path: "module-view-student",
    component: ModuleViewStudentComponent,
    title: "Student Module View",
    canActivate: [AuthRoute]
  },
];

export default routeConfig;
