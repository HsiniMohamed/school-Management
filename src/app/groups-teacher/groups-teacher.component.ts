import { Component, OnInit } from "@angular/core";
import { GroupService } from "../services/group.service";
import { CategoryService } from "../services/category.service";
import { Router } from "@angular/router";
import jwt_decode from "jwt-decode";
import { CoursService } from "../services/cours.service";

@Component({
  selector: "app-groups-teacher",
  templateUrl: "./groups-teacher.component.html",
  styleUrls: ["./groups-teacher.component.css"],
})
export class GroupsTeacherComponent implements OnInit {
  decodedToken: any;
  categories: any;
  groups: any;

  constructor(
    private groupService: GroupService,
    private categoryService: CategoryService,
    private coursService: CoursService,
    private router: Router
  ) {}
  ngOnInit() {
    let groupsTab: any = [];
    if (
      this.isLoggedIn() &&
      this.decodedToken &&
      this.decodedToken.role == "teacher"
    ) {
      this.coursService
        .getAllCoursByTeacherId(this.decodedToken.userId)
        .subscribe((response) => {
          // this.groupsTab = [];
          for (let i = 0; i < response.courses.length; i++) {
            this.categoryService
              .getCategoryByIdCourse(response.courses[i]._id)
              .subscribe((resp) => {
                for (let j = 0; j < resp.categories.length; j++) {
                  console.log(resp.categories[j]._id);
                  this.groupService
                    .getGroupeByIdCategory(resp.categories[j]._id)
                    .subscribe((group) => {
                      groupsTab.push(group.group);
                      this.groups = this.removeDuplicates(groupsTab, "_id");
                      console.log(this.groups);
                    });
                }
              });
          }
        });
    }
  }
  //Supprimer les doublons d'un tableau d'objets
  removeDuplicates(array, key) {
    const seen = new Set();
    return array.filter((item) => {
      const itemKey = item[key];
      if (!seen.has(itemKey)) {
        seen.add(itemKey);
        return true;
      }
      return false;
    });
  }
  displayGroup(id) {
    this.router.navigate([`group-infos/${id}`]);
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
