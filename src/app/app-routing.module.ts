import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { SignupComponent } from "./components/signup/signup.component";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ContactComponent } from "./components/contact/contact.component";
import { QuoteComponent } from "./components/quote/quote.component";
import { AddCoursComponent } from "./components/add-cours/add-cours.component";
import { AddCategoryComponent } from "./components/add-category/add-category.component";
import { AddGroupComponent } from "./components/add-group/add-group.component";
import { GroupInfoComponent } from "./components/group-info/group-info.component";
import { PayementInfosComponent } from "./components/payement-infos/payement-infos.component";
import { TrainigSessionComponent } from "./components/trainig-session/trainig-session.component";
import { TrainigSessionsComponent } from "./components/trainig-sessions/trainig-sessions.component";
import { DashboardStudentComponent } from "./components/dashboard-student/dashboard-student.component";
import { DashboardTeacherComponent } from "./components/dashboard-teacher/dashboard-teacher.component";
import { DashboardAdminComponent } from "./components/dashboard-admin/dashboard-admin.component";
import { CoursesComponent } from "./components/courses/courses.component";
import { InstructorsComponent } from "./components/instructors/instructors.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "signup-student", component: SignupComponent },
  { path: "signup-teacher", component: SignupComponent },
  { path: "signup-admin", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "mot-de-passe-oublie", component: ForgotPasswordComponent },
  { path: "reset-password/:resetToken/:id", component: ResetPasswordComponent },
  { path: "contact", component: ContactComponent },
  { path: "quote/:categoryId", component: QuoteComponent },
  { path: "add-cours", component: AddCoursComponent },
  { path: "edit-cours/:id", component: AddCoursComponent },
  { path: "add-category", component: AddCategoryComponent },
  { path: "edit-category/:id", component: AddCategoryComponent },
  { path: "add-group", component: AddGroupComponent },
  { path: "group-infos/:id", component: GroupInfoComponent },
  { path: "sessions-training", component: TrainigSessionsComponent },
  { path: "sessions-training/:search", component: TrainigSessionsComponent },
  { path: "session-single/:id", component: TrainigSessionComponent },
  {
    path: "payement-infos/:studentId/:groupId/:categoryId",
    component: PayementInfosComponent,
  },
  {
    path: "dashboard-student",
    component: DashboardStudentComponent,
  },
  {
    path: "dashboard-teacher",
    component: DashboardTeacherComponent,
  },
  {
    path: "dashboard-admin",
    component: DashboardAdminComponent,
  },
  {
    path: "instructors",
    component: InstructorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
