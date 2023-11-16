import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CoursService } from "src/app/services/cours.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-categories",
  templateUrl: "./display-categories.component.html",
  styleUrls: ["./display-categories.component.css"],
})
export class DisplayCategoriesComponent implements OnInit {
  categoriesTab: [];
  constructor(
    private coursService: CoursService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.categoryService.getAllCategories().subscribe((response) => {
      for (let i = 0; i < response.categories.length; i++) {
        response.categories[i].courses = [];

        for (let j = 0; j < response.categories[i].coursesId.length; j++) {
          this.coursService
            .getCoursById(response.categories[i].coursesId[j])
            .subscribe((res) => {
              response.categories[i].courses.push(res.cours.name);
            });
        }
      }
      this.categoriesTab = response.categories;
      console.log("haha", this.categoriesTab);
    });
  }
  editCategory(idCat) {
    this.router.navigate([`edit-category/${idCat}`]);
  }
  deleteCategory(idCat) {
    this.categoryService.deleteCategory(idCat).subscribe((response) => {
      if (response.message == "1") {
        Swal.fire({
          title: "Training course deleted !!",
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
