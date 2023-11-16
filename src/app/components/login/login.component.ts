import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMsg: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
      pwd: ["", [Validators.required]],
    });
  }
  login() {
    this.userService.login(this.loginForm.value).subscribe((response) => {
      console.log("here response from back end", response);
      if (response.msg == "2") {
        sessionStorage.setItem("jwt", response.user);
        this.router.navigate([""]);
      } else {
        this.errorMsg = "Please Check email/pwd";
      }
    });
  }
}
