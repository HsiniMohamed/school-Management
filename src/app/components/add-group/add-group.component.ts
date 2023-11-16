import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { GroupService } from "src/app/services/group.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
  styleUrls: ["./add-group.component.css"],
})
export class AddGroupComponent implements OnInit {
  groupForm: FormGroup;
  group: any = {};
  categories: [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((response) => {
      this.categories = response.categories;
    });
  }
  addNewClass() {
    this.group.date = new Date();
    this.group.studentsId = [];
    this.groupService.addGroupe(this.group).subscribe((response) => {
      if (response.message == "1") {
        Swal.fire({
          icon: "success",
          text: "Trainig Course added with success  !!",
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
