import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  resetToken: string = "";
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      pwd: [""],
    });
    this.resetToken = this.activatedRoute.snapshot.paramMap.get("resetToken");
  }
  resetPassword() {
    console.log("heretoken ,paswword", this.resetForm.value, this.resetToken);
  }
}
