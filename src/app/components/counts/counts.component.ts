import { Component, OnInit } from "@angular/core";
import { CategoryService } from "src/app/services/category.service";
import { CoursService } from "src/app/services/cours.service";
import { GroupService } from "src/app/services/group.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-counts",
  templateUrl: "./counts.component.html",
  styleUrls: ["./counts.component.css"],
})
export class CountsComponent implements OnInit {
  studentsCount: any;
  teachersCount: any;
  coursesCount: any;
  categoriesCount: any;
  groupsCount: any;
  constructor(
    private courseService: CoursService,
    private userService: UserService,
    private categoryService: CategoryService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.userService.getAllStudents().subscribe((response) => {
      this.studentsCount = response.usersTab.length;
    });
    this.userService.getAllTeachers().subscribe((response) => {
      this.teachersCount = response.teachersTab.length;
    });
    this.courseService.getAllCours().subscribe((response) => {
      this.coursesCount = response.courses.length;
    });
    this.categoryService.getAllCategories().subscribe((response) => {
      this.categoriesCount = response.categories.length;
    });
    this.groupService.getAllGroupes().subscribe((response) => {
      this.groupsCount = response.groups.length;
    });
  }
}
