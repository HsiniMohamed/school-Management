import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

@Component({
  selector: "app-dashboard-admin",
  templateUrl: "./dashboard-admin.component.html",
  styleUrls: ["./dashboard-admin.component.css"],
})
export class DashboardAdminComponent implements OnInit {
  decodedToken: any;
  user: any = {};
  userUpdate: any = {};
  constructor(private userService: UserService) {}

  ngOnInit() {
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "admin"
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
