import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  user: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService
      .getUserById(this.activatedRoute.snapshot.paramMap.get("id"))
      .subscribe((response) => {
        this.user = response.user;
      });
  }
  resetPassword() {
    console.log("here obj", this.user);
    this.userService.editUser(this.user).subscribe((response) => {
      if (response.message == "1") {
        Swal.fire({
          title: "  Your password has been successfully changed !!",
          showConfirmButton: false,
          icon: "success",
        });
        this.router.navigate(["login"]);
      } else {
        Swal.fire({
          title: "  Error !!",
          showConfirmButton: false,
          icon: "error",
        });
      }
    });
  }
}
