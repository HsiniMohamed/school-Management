import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import jwt_decode from "jwt-decode";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-dashboard-student",
  templateUrl: "./dashboard-student.component.html",
  styleUrls: ["./dashboard-student.component.css"],
})
export class DashboardStudentComponent implements OnInit {
  decodedToken: any;
  user: any = {};
  userUpdate: any = {};

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "student"
    ) {
      this.getUserProfile();
    }
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

  getUserProfile() {
    this.userService
      .getUserById(this.decodedToken.userId)
      .subscribe((response) => {
        this.user = response.user;
      });
  }

  onImageSelected(event: any) {
    // Afficher le bouton Valider lorsque l'utilisateur a sélectionné une image
    const imageInput = document.getElementById("imageInput");
    const validateButton = document.getElementById("validateButton");
    if (imageInput && validateButton) {
      validateButton.style.display = "block";
    }
    //update photo
    const file = (event.target as HTMLInputElement).files[0];
    this.userUpdate.photo = file;
  }
  updateProfileImage() {
    this.userService
      .updateProfilePhoto(this.userUpdate.photo, this.user._id)
      .subscribe((response) => {
        console.log(response.message);
        if (response.message == "1") {
          this.getUserProfile();
          document.getElementById("validateButton").style.display = "none";
        } else {
          Swal.fire({
            icon: "error",
            text: "Error updating profile photo  !",
          });
        }
      });
  }
}
