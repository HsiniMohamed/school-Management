import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: any;
  decodedToken: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      phone: ["", [Validators.required, Validators.pattern("[0-9 ]{8}")]],
      adresse: [""],
    });
    if (this.isLoggedIn() && this.decodedToken) {
      this.userService
        .getUserById(this.decodedToken.userId)
        .subscribe((response) => {
          this.userProfile = response.user;
          console.log(this.userProfile);
        });
    }
  }

  editProfile() {
    this.userService.editProfile(this.userProfile).subscribe((response) => {
      console.log("response from BE ", response);
      if (response.message == "1") {
        Swal.fire({
          icon: "success",
          text: "Your profile is up to date !!",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "Echec !!",
        });
      }
    });
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
