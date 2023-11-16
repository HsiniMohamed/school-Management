import { Component, OnInit } from "@angular/core";
import { AdministrationService } from "src/app/services/administration.service";
import jwt_decode from "jwt-decode";
import { GroupService } from "src/app/services/group.service";
import { CategoryService } from "src/app/services/category.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-payments-student",
  templateUrl: "./payments-student.component.html",
  styleUrls: ["./payments-student.component.css"],
})
export class PaymentsStudentComponent implements OnInit {
  payments: any;
  decodedToken: any;

  constructor(
    private administrationService: AdministrationService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "student"
    ) {
      this.administrationService
        .getAllPaymentsByIdStudent(this.decodedToken.userId)
        .subscribe((response) => {
          this.payments = response.payements;
          for (let i = 0; i < this.payments.length; i++) {
            this.groupService
              .getGroupeById(this.payments[i].groupId)
              .subscribe((resp) => {
                this.payments[i].class = resp.group.name;
                this.categoryService
                  .getCategoryById(resp.group.categoryId)
                  .subscribe((respo) => {
                    this.payments[i].categoryId = respo.category._id;
                    this.payments[i].categoryName = respo.category.name;
                  });
              });
          }
        });
    }
  }
  askPaymentSummary(groupName, categoryName) {
    let askObject: any = {};
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "student"
    ) {
      askObject.firstName = this.decodedToken.fName;
      askObject.lastName = this.decodedToken.lName;
      askObject.email = this.decodedToken.email;
      askObject.className = groupName;
      askObject.categoryName = categoryName;
      this.administrationService
        .requestForAnInvoice(askObject)
        .subscribe((response) => {
          if (response.message == "1") {
            Swal.fire({
              icon: "success",
              text: "The payment summary request was sent successfully!!",
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Echec  !!",
            });
          }
        });
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
}
