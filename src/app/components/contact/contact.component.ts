import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  errorMsgEmail: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }
  sendMessage() {
    this.userService
      .sendMessage(this.contactForm.value)
      .subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            title: "  Your message is sent successfully !!",
            showConfirmButton: false,
            icon: "success",
          });
          this.router.navigate([""]);
        } else {
          Swal.fire({
            title: "  An error occurred while sending the email !!",
            showConfirmButton: false,
            icon: "error",
          });
        }
      });
  }
}
