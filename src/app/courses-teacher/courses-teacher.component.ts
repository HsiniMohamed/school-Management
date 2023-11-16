import { Component, OnInit } from "@angular/core";
import { CoursService } from "../services/cours.service";
import jwt_decode from "jwt-decode";
import { Router } from "@angular/router";

@Component({
  selector: "app-courses-teacher",
  templateUrl: "./courses-teacher.component.html",
  styleUrls: ["./courses-teacher.component.css"],
})
export class CoursesTeacherComponent implements OnInit {
  decodedToken: any;
  coursesTab = [];
  constructor(private coursService: CoursService, private router: Router) {}

  ngOnInit() {
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "teacher"
    ) {
      this.coursService
        .getAllCoursByTeacherId(this.decodedToken.userId)
        .subscribe((response) => {
          this.coursesTab = response.courses;
        });
    }
  }
  isLoggedIn() {
    const token = sessionStorage.getItem("jwt");
    if (token) {
      this.decodedToken = this.decodeToken(token);
    }
    return !!token;
  }

  decodeToken(token: string) {
    return jwt_decode(token);
  }
  editCourse(id) {
    this.router.navigate([`edit-cours/${id}`]);
  }
}
