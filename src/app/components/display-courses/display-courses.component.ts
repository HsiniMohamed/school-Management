import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CoursService } from "src/app/services/cours.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-courses",
  templateUrl: "./display-courses.component.html",
  styleUrls: ["./display-courses.component.css"],
})
export class DisplayCoursesComponent implements OnInit {
  coursesTab: [];
  constructor(
    private coursService: CoursService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.coursService.getAllCours().subscribe((response) => {
      for (let i = 0; i < response.courses.length; i++) {
        this.userService
          .getUserById(response.courses[i].teacherId)
          .subscribe((res) => {
            response.courses[i].teacherName =
              res.user.firstName + " " + res.user.lastName;
          });
      }
      this.coursesTab = response.courses;
    });
  }
  deleteCourse(id) {
    this.coursService.deleteCours(id).subscribe((response) => {
      if (response.message == "1") {
        Swal.fire({
          title: "Course deleted !!",
          showConfirmButton: false,
          icon: "warning",
        });
        this.getAll();
      } else {
        Swal.fire({
          title: "Not deleted !!",
          showConfirmButton: false,
          icon: "warning",
        });
      }
    });
  }
  editCourse(id) {
    this.router.navigate([`edit-cours/${id}`]);
  }
}
