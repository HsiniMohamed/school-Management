import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

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
        console.log(
          "Demande de réinitialisation envoyée avec succès",
          response.message
        );
        // Vous pouvez afficher un message à l'utilisateur ici
      });
  }
}
