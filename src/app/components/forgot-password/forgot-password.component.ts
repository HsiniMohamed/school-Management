import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
    });
  }

  resetPassword() {
    console.log("emailllll", this.resetForm.value.email);

    this.userService
      .resetPassword(this.resetForm.value)
      .subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            title: "  Reset request sent successfully !!",
            showConfirmButton: false,
            icon: "success",
          });
        } else if (response.message == "0") {
          Swal.fire({
            title: "  The user does not exist.!!",
            showConfirmButton: false,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: response.message,
            showConfirmButton: false,
            icon: "error",
          });
        }
      });
  }
}
