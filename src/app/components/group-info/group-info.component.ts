import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CoursService } from "src/app/services/cours.service";
import { GroupService } from "src/app/services/group.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-group-info",
  templateUrl: "./group-info.component.html",
  styleUrls: ["./group-info.component.css"],
})
export class GroupInfoComponent implements OnInit {
  studentForm: FormGroup;
  student: any = {};
  group: any = {};
  category: any = {};
  students: [];
  courses: [];
  studentsClass: any;
  coursesClass: any;
  decodedToken: any;

  constructor(
    private coursService: CoursService,
    private userService: UserService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userService.getAllStudents().subscribe((response) => {
      this.students = response.usersTab;
    });
    this.groupService
      .getGroupeById(this.activatedRoute.snapshot.paramMap.get("id"))
      .subscribe((response) => {
        this.group = response.group;
        //Getting Category
        this.categoryService
          .getCategoryById(response.group.categoryId)
          .subscribe((resp) => {
            this.category = resp.category;
            //Getting list of Courses
            this.coursesClass = [];
            for (let i = 0; i < resp.category.coursesId.length; i++) {
              this.coursService
                .getCoursById(resp.category.coursesId[i])
                .subscribe((respo) => {
                  this.coursesClass.push(respo.cours);
                });
            }
          });

        // Getting list of students
        this.studentsClass = [];
        for (let i = 0; i < response.group.studentsId.length; i++) {
          this.userService
            .getUserById(response.group.studentsId[i])
            .subscribe((res) => {
              this.studentsClass.push(res.user);
            });
        }
      });
  }
  addStudent() {
    let isExist = false;
    for (let i = 0; i < this.group.studentsId.length; i++) {
      if (this.student.studentId == this.group.studentsId[i]) {
        isExist = true;
        break;
      }
    }
    if (isExist || this.student.studentId == null) {
      Swal.fire({
        icon: "error",
        text: "This Student  already exists in this training  !",
      });
    } else {
      this.group.studentsId.push(this.student.studentId);
      this.groupService.editGroup(this.group).subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            icon: "success",
            text: "Student added with success  !",
          });
          // this.router.navigate(["admin"]);
        }
      });
    }
  }
  showPayementStatus(studentId, groupId, categoryId) {
    this.router.navigate([
      `payement-infos/${studentId}/${groupId}/${categoryId}`,
    ]);
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
