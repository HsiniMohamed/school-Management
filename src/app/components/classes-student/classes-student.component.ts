import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import jwt_decode from "jwt-decode";
import { GroupService } from "src/app/services/group.service";

@Component({
  selector: "app-classes-student",
  templateUrl: "./classes-student.component.html",
  styleUrls: ["./classes-student.component.css"],
})
export class ClassesStudentComponent implements OnInit {
  decodedToken: any;
  groups: any;
  constructor(private groupService: GroupService, private router: Router) {}

  ngOnInit() {
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "student"
    ) {
      this.groupService
        .getClassesByIdStudent(this.decodedToken.userId)
        .subscribe((response) => {
          this.groups = response.groups;
        });
    }
  }
  displayGroup(id) {
    this.router.navigate([`group-infos/${id}`]);
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
}
