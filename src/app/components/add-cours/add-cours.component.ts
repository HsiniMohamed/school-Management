import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CoursService } from "src/app/services/cours.service";
import Swal from "sweetalert2";
import { UserService } from "src/app/services/user.service";
@Component({
  selector: "app-add-cours",
  templateUrl: "./add-cours.component.html",
  styleUrls: ["./add-cours.component.css"],
})
export class AddCoursComponent implements OnInit {
  courseForm: FormGroup;
  imagePreview: string = "";
  cours: any = {};
  id: any;
  tittle: string = "Add a new Course";
  teachers: [];

  constructor(
    private router: Router,
    private coursService: CoursService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userService.getAllTeachers().subscribe((response) => {
      this.teachers = response.teachersTab.filter(
        (elt) => elt.validity == "Valid"
      );
      console.log(this.teachers);
    });

    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.tittle = "Edit Course";
      this.coursService.getCoursById(this.id).subscribe((response) => {
        this.cours = response.cours;
      });
    }
  }
  addCours() {
    if (this.id) {
      this.coursService.editCours(this.cours).subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            icon: "success",
            text: "Course edited with success  !  !",
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "Echec !!",
          });
        }
      });
    } else {
      this.coursService
        .addCours(this.cours, this.cours.photo)
        .subscribe((response) => {
          if (response.message == "1") {
            Swal.fire({
              icon: "success",
              text: "Course added with success  !!",
            });
          }
        });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.cours.photo = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
