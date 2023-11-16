import { Component, OnInit } from "@angular/core";
import { CoursService } from "src/app/services/cours.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-instructors",
  templateUrl: "./instructors.component.html",
  styleUrls: ["./instructors.component.css"],
})
export class InstructorsComponent implements OnInit {
  instructors: [];
  constructor(
    private userService: UserService,
    private coursService: CoursService
  ) {}

  ngOnInit() {
    this.userService.getAllTeachers().subscribe((response) => {
      for (let i = 0; i < response.teachersTab.length; i++) {
        this.coursService
          .getAllCoursByTeacherId(response.teachersTab[i]._id)
          .subscribe((respo) => {
            response.teachersTab[i].courses = respo.courses;
          });
      }
      this.instructors = response.teachersTab;
      console.log(this.instructors);
    });
  }
}
