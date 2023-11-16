import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdministrationService } from "src/app/services/administration.service";
import { CategoryService } from "src/app/services/category.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-quote",
  templateUrl: "./quote.component.html",
  styleUrls: ["./quote.component.css"],
})
export class QuoteComponent implements OnInit {
  quoteForm: FormGroup;
  errorMsgPhone: any;
  errorMsgEmail: any;
  category: any = {};
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private categoryService: CategoryService,
    private administrationService: AdministrationService
  ) {}

  ngOnInit() {
    this.categoryService
      .getCategoryById(this.activatedRoute.snapshot.paramMap.get("categoryId"))
      .subscribe((response) => {
        this.category = response.category;
        console.log(response.category);
      });
    this.quoteForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      phone: ["", [Validators.required, Validators.pattern("[0-9 ]{8}")]],
      email: ["", [Validators.required, Validators.email]],
      date: [""],
      categoryId: [""],
      trainingSession: [""],
      planingOption: [""],
      state: [""],
    });
  }
  askForaQuote() {
    this.quoteForm.value.date = Date.now();
    this.quoteForm.value.state = "Pending";
    this.quoteForm.value.categoryId =
      this.activatedRoute.snapshot.paramMap.get("categoryId");
    this.quoteForm.value.trainingSession =
      this.category.name + " " + this.category.description;
    this.administrationService
      .askForaQuote(this.quoteForm.value)
      .subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            title: "  Your request is sent successfully !!",
            text: "we will respond to you in maximum 24 hours",
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
