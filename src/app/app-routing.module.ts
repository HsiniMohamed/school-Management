import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { SignupComponent } from "./components/signup/signup.component";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "signup-student", component: SignupComponent },
  { path: "signup-teacher", component: SignupComponent },
  { path: "signup-admin", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "mot-de-passe-oublie", component: ForgotPasswordComponent },
  { path: "reset-password/:resetToken", component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
