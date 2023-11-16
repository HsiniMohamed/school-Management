import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-students",
  templateUrl: "./display-students.component.html",
  styleUrls: ["./display-students.component.css"],
})
export class DisplayStudentsComponent implements OnInit {
  usersTab: [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getAll();
  }
  deleteUser(id) {
    this.userService.deleteUserById(id).subscribe((response) => {
      if (response.msg == "1") {
        Swal.fire({
          title: "Student deleted !!",
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
    this.userService.getAllStudents().subscribe((response) => {
      console.log(response.usersTab);
      this.usersTab = response.usersTab;
    });
  }
}
