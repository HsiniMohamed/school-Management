import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdministrationService } from "src/app/services/administration.service";
import { CategoryService } from "src/app/services/category.service";
import { GroupService } from "src/app/services/group.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-display-payments",
  templateUrl: "./display-payments.component.html",
  styleUrls: ["./display-payments.component.css"],
})
export class DisplayPaymentsComponent implements OnInit {
  payments: any;

  constructor(
    private administrationService: AdministrationService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.administrationService.getAllPayements().subscribe((response) => {
      this.payments = response.payements;
      for (let i = 0; i < this.payments.length; i++) {
        this.userService
          .getUserById(this.payments[i].userId)
          .subscribe((respon) => {
            this.payments[i].student =
              respon.user.firstName + " " + respon.user.lastName;
          });
        this.groupService
          .getGroupeById(this.payments[i].groupId)
          .subscribe((respo) => {
            this.payments[i].class = respo.group.name;
            this.categoryService
              .getCategoryById(respo.group.categoryId)
              .subscribe((resp) => {
                this.payments[i].categoryName = resp.category.name;
                this.payments[i].categoryId = resp.category._id;
              });
          });
      }
    });
  }

  showPayementStatus(studentId, groupId, categoryId) {
    this.router.navigate([
      `payement-infos/${studentId}/${groupId}/${categoryId}`,
    ]);
  }
}
