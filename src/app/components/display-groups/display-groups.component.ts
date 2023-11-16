import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { GroupService } from "src/app/services/group.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-groups",
  templateUrl: "./display-groups.component.html",
  styleUrls: ["./display-groups.component.css"],
})
export class DisplayGroupsComponent implements OnInit {
  groupsTab: [];
  constructor(
    private groupService: GroupService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.groupService.getAllGroupes().subscribe((response) => {
      for (let i = 0; i < response.groups.length; i++) {
        this.categoryService
          .getCategoryById(response.groups[i].categoryId)
          .subscribe((res) => {
            response.groups[i].categoryName = res.category.name;
          });
      }
      this.groupsTab = response.groups;
    });
  }
  displayGroup(id) {
    this.router.navigate([`group-infos/${id}`]);
  }
  deleteGroup(id) {
    this.groupService.deleteGroup(id).subscribe((response) => {
      if (response.message == "1") {
        Swal.fire({
          title: "Class deleted !!",
          showConfirmButton: false,
          icon: "warning",
        });
        this.getAll();
      } else {
        Swal.fire({
          title: "Not deleted !!",
          showConfirmButton: false,
          icon: "warning",
        });
      }
    });
  }
}
