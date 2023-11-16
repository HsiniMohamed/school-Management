import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AdministrationService } from "src/app/services/administration.service";
import { CategoryService } from "src/app/services/category.service";
import { GroupService } from "src/app/services/group.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-payement-infos",
  templateUrl: "./payement-infos.component.html",
  styleUrls: ["./payement-infos.component.css"],
})
export class PayementInfosComponent implements OnInit {
  payementForm = FormGroup;
  payment: any = {};

  student: any = {};
  group: any = {};
  category: any = {};
  msgError = "";
  msgSlice = "";
  isExist = false;
  paymentSummary: any = {};
  decodedToken: any;

  constructor(
    private administrationService: AdministrationService,
    private userService: UserService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userService
      .getUserById(this.activatedRoute.snapshot.paramMap.get("studentId"))
      .subscribe((response) => {
        this.student = response.user;
      });
    //------------------------
    this.groupService
      .getGroupeById(this.activatedRoute.snapshot.paramMap.get("groupId"))
      .subscribe((response) => {
        this.group = response.group;
      });
    //------------------------
    this.categoryService
      .getCategoryById(this.activatedRoute.snapshot.paramMap.get("categoryId"))
      .subscribe((response) => {
        this.category = response.category;
      });

    //------------------------

    this.administrationService
      .getPaymentByIdStudent(
        this.activatedRoute.snapshot.paramMap.get("studentId"),
        this.activatedRoute.snapshot.paramMap.get("groupId")
      )
      .subscribe((response) => {
        if (response.payement) {
          this.payment = response.payement;
          if (this.payment.fullyPaid == true) {
            this.msgError = "The amount is fully paid!!!!";
          } else {
            const indexWord = this.numberToWords(
              this.payment.slices.indexOf(false)
            );
            this.msgError = ` Payment up to the  " ${indexWord} " tranche of the total amount !!`;
            const indexWord2 = this.numberToWords(
              this.payment.slices.indexOf(false) + 1
            );
            this.msgSlice = ` Payment of the " ${indexWord2} " tranche of the total amount !!`;
          }
          this.isExist = true;
        } else {
          this.msgError = "This student has not yet made any payment !!";
        }
      });
  }
  makePayment() {
    //aucun paiement efectué par cet etudiant
    if (!this.isExist) {
      this.payment.slices = [];
      this.payment.date = new Date();
      this.payment.userId = this.student._id;
      this.payment.groupId = this.group._id;
      //paiement total des frais
      if (this.payment.method == "fullpayment") {
        this.payment.fullyPaid = true;
        console.log("fullpayment");
      }
      //paiement par tranches
      else if (this.payment.method == "slices") {
        this.payment.fullyPaid = false;
        this.payment.slices[0] = true;
        for (let i = 1; i < 4; i++) {
          this.payment.slices[i] = false;
        }
        console.log("slices");
      }
      //affectation d'un nouveau paiement
      this.administrationService
        .makePayement(this.payment)
        .subscribe((response) => {
          if (response.message == "1") {
            Swal.fire({
              icon: "success",
              text: "Payment Successfully Completed  !!",
            });
            setTimeout(function () {
              window.location.reload();
            }, 3000);
          } else {
            Swal.fire({
              icon: "error",
              text: "Echec  !!",
            });
          }
        });
    }
    // paiement d'une nouvelle tranche et mis a jour d'etat de paiement
    else {
      if (this.payment.method && this.payment.slices.length == 4) {
        this.payment.slices[this.payment.slices.indexOf(false)] = true;
        if (!this.payment.slices.includes(false)) {
          this.payment.fullyPaid = true;
        }
        this.administrationService
          .updatePayement(this.payment)
          .subscribe((response) => {
            if (response.message == "1") {
              Swal.fire({
                icon: "success",
                text: "Payment Updated successfully  !!",
              });
              setTimeout(function () {
                window.location.reload();
              }, 3000);
            } else {
              Swal.fire({
                icon: "error",
                text: "Echec  !!",
              });
            }
          });
      }
    }
  }
  sendPaymentSummary() {
    this.paymentSummary.nameUser =
      this.student.firstName + " " + this.student.lastName;
    this.paymentSummary.email = this.student.email;
    this.paymentSummary.groupName = this.group.name;
    this.paymentSummary.categoryName = this.category.name;
    this.paymentSummary.summaryPayment = this.msgError;
    this.administrationService
      .sendInvoice(this.paymentSummary)
      .subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            icon: "success",
            text: "The payment summary has been sent successfully!!",
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "Echec  !!",
          });
        }
      });
  }
  // Fonction pour convertir un nombre en mots
  numberToWords(num) {
    const words = ["", "First", "Second", "Third", "Fourth"];
    return words[num];
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
