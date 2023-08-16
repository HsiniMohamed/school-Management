import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMsgPhone: any;
  errorMsgEmail: any;
  imagePreview: any;
  cvPreview: string = "";
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      phone: ["", [Validators.required, Validators.pattern("[0-9 ]{8}")]],
      adresse: [""],
      specialite: [""],
      email: ["", [Validators.required, Validators.email]],
      pwd: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(8)],
      ],
      confirmPwd: ["", [Validators.required]],
      photo: [""],
      cv: [""],
    });
  }

  signup() {
    //Users Role
    this.signupForm.value.role =
      this.router.url == "/signup-student"
        ? "student"
        : this.router.url == "/signup-teacher"
        ? "teacher"
        : "admin";
    if (this.signupForm.value.role == "student") {
      this.userService
        .signupStudent(this.signupForm.value, this.signupForm.value.photo)
        .subscribe((response) => {
          if (response.message == "0") {
            this.errorMsgEmail = "Email Exists";
          } else if (response.message == "1") {
            this.errorMsgPhone = "Phone Exists";
          } else {
            this.router.navigate([""]);
          }
        });
    } else if (this.signupForm.value.role == "teacher") {
      this.signupForm.value.validity = "pending";
      this.userService
        .signupTeacher(
          this.signupForm.value,
          this.signupForm.value.cv,
          this.signupForm.value.photo
        )
        .subscribe((response) => {
          if (response.message == "0") {
            this.errorMsgEmail = "Email Exists";
          } else if (response.message == "1") {
            this.errorMsgPhone = "Phone Exists";
          } else {
            this.router.navigate([""]);
          }
        });
    } else {
      this.userService
        .signupAdmin(this.signupForm.value)
        .subscribe((response) => {
          console.log("resp", response);

          if (response.message == "0") {
            this.errorMsgEmail = "Email Exists";
          } else if (response.message == "1") {
            this.errorMsgPhone = "Phone Exists";
          } else {
            this.router.navigate([""]);
          }
        });
    }
  }
  // Confirm Password Validator
  passwordsMatch(): boolean {
    const pwd = this.signupForm.get("pwd").value;
    const confirmPwd = this.signupForm.get("confirmPwd").value;
    return pwd === confirmPwd;
  }
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({ photo: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCvSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({ cv: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.cvPreview = reader.result as string;
      console.log(this.cvPreview);
    };
    reader.readAsDataURL(file);
  }
}
