import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";

@Component({
  selector: "app-top-courses",
  templateUrl: "./top-courses.component.html",
  styleUrls: ["./top-courses.component.css"],
})
export class TopCoursesComponent implements OnInit {
  categories = [];
  search: any;
  msgError: any;
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.search = this.activatedRoute.snapshot.paramMap.get("search");
    console.log(this.search);
    if (this.search) {
      this.categoryService.searchCategory(this.search).subscribe((response) => {
        if (response.categoriesTab && response.categoriesTab.length > 0) {
          this.categories = response.categoriesTab;
        } else {
          this.msgError = "No Courses Found";
        }
      });
    } else {
      this.categoryService.getAllCategories().subscribe((response) => {
        this.categories = response.categories;
      });
    }
  }
  goTocategoryInfo(categoryId) {
    this.router.navigate([`session-single/${categoryId}`]);
  }
}
