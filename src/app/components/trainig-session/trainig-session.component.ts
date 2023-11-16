import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CoursService } from "src/app/services/cours.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-trainig-session",
  templateUrl: "./trainig-session.component.html",
  styleUrls: ["./trainig-session.component.css"],
})
export class TrainigSessionComponent implements OnInit {
  coursesTab: any;
  category: any;
  constructor(
    private categoryService: CategoryService,
    private coursService: CoursService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService
      .getCategoryById(this.activatedRoute.snapshot.paramMap.get("id"))
      .subscribe((response) => {
        this.category = response.category;
        this.coursesTab = [];
        for (let i = 0; i < response.category.coursesId.length; i++) {
          this.coursService
            .getCoursById(response.category.coursesId[i])
            .subscribe((respo) => {
              this.coursesTab.push(respo.cours);
              for (let j = 0; j < this.coursesTab.length; j++) {
                this.userService
                  .getUserById(this.coursesTab[j].teacherId)
                  .subscribe((teacher) => {
                    this.coursesTab[i].teacher =
                      teacher.user.firstName + " " + teacher.user.lastName;
                  });
              }
            });
        }
      });
  }
  requestQuote(categoryId) {
    this.router.navigate([`quote/${categoryId}`]);
  }
}
