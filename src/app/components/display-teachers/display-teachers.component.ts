import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-teachers",
  templateUrl: "./display-teachers.component.html",
  styleUrls: ["./display-teachers.component.css"],
})
export class DisplayTeachersComponent implements OnInit {
  usersTab: [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getAll();
  }
  deleteUser(id) {
    this.userService.deleteUserById(id).subscribe((response) => {
      if (response.msg == "1") {
        Swal.fire({
          title: "Teacher deleted !!",
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
  getAll() {
    this.userService.getAllTeachers().subscribe((response) => {
      this.usersTab = response.teachersTab;
    });
  }
  validate(id) {
    this.userService.getUserById(id).subscribe((response) => {
      this.userService.validateTeacher(response.user).subscribe((respo) => {
        if (respo.message == "1") {
          Swal.fire({
            title: " The teacher is validated !!",
            showConfirmButton: false,
            icon: "success",
          });
          this.getAll();
        }
      });
    });
  }
}
