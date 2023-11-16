import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SignupComponent } from "./components/signup/signup.component";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ContactComponent } from './components/contact/contact.component';
import { QuoteComponent } from './components/quote/quote.component';
import { AddCoursComponent } from './components/add-cours/add-cours.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { DisplayTeachersComponent } from './components/display-teachers/display-teachers.component';
import { DisplayStudentsComponent } from './components/display-students/display-students.component';
import { DisplayGroupsComponent } from './components/display-groups/display-groups.component';
import { DisplayCategoriesComponent } from './components/display-categories/display-categories.component';
import { DisplayCoursesComponent } from './components/display-courses/display-courses.component';
import { DisplayPayementsComponent } from './components/display-payements/display-payements.component';
import { DisplayQuotesComponent } from './components/display-quotes/display-quotes.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { PayementInfosComponent } from './components/payement-infos/payement-infos.component';
import { TrainigSessionsComponent } from './components/trainig-sessions/trainig-sessions.component';
import { TrainigSessionComponent } from './components/trainig-session/trainig-session.component';
import { SearchCoursesComponent } from './components/search-courses/search-courses.component';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student.component';
import { DashboardTeacherComponent } from './components/dashboard-teacher/dashboard-teacher.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { ClassesStudentComponent } from './components/classes-student/classes-student.component';
import { PaymentsStudentComponent } from './components/payments-student/payments-student.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CoursesTeacherComponent } from './courses-teacher/courses-teacher.component';
import { GroupsTeacherComponent } from './groups-teacher/groups-teacher.component';
import { DisplayPaymentsComponent } from './components/display-payments/display-payments.component';
import { CoursesComponent } from './components/courses/courses.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { SingleInstructorComponent } from './components/single-instructor/single-instructor.component';
import { TopCoursesComponent } from './components/top-courses/top-courses.component';
import { CountsComponent } from './components/counts/counts.component';
import { NoticeComponent } from './components/notice/notice.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ContactComponent,
    QuoteComponent,
    AddCoursComponent,
    AddCategoryComponent,
    AddGroupComponent,
    DisplayTeachersComponent,
    DisplayStudentsComponent,
    DisplayGroupsComponent,
    DisplayCategoriesComponent,
    DisplayCoursesComponent,
    DisplayPayementsComponent,
    DisplayQuotesComponent,
    GroupInfoComponent,
    PayementInfosComponent,
    TrainigSessionsComponent,
    TrainigSessionComponent,
    SearchCoursesComponent,
    DashboardStudentComponent,
    DashboardTeacherComponent,
    DashboardAdminComponent,
    ClassesStudentComponent,
    PaymentsStudentComponent,
    EditProfileComponent,
    CoursesTeacherComponent,
    GroupsTeacherComponent,
    DisplayPaymentsComponent,
    CoursesComponent,
    InstructorsComponent,
    SingleInstructorComponent,
    TopCoursesComponent,
    CountsComponent,
    NoticeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
