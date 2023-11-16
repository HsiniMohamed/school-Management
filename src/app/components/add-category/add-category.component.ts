import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CoursService } from "src/app/services/cours.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.css"],
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  imagePreview: string = "";
  category: any = {};
  id: any;
  tittle: string = "Add a new Trainig course";
  courses: [];
  // coursesId: string[];
  constructor(
    private router: Router,
    private coursService: CoursService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.coursService.getAllCours().subscribe((response) => {
      this.courses = response.courses;
    });
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.tittle = "Edit Trainig course";
      this.categoryService.getCategoryById(this.id).subscribe((response) => {
        this.category = response.category;
        console.log(this.category);
        console.log("jhfzfzhfz", this.category.coursesId);
      });
    }
  }
  addCategory() {
    if (this.id) {
      let isExist = false;
      for (let i = 0; i < this.category.coursesId.length; i++) {
        if (this.category.coursesId[i] == this.category.coursId) {
          isExist = true;
          break;
        }
      }
      if (isExist || this.category.coursId == null) {
        Swal.fire({
          icon: "error",
          text: "This course already exists in this training !!",
        });
      } else {
        this.category.coursesId.push(this.category.coursId);
        this.categoryService
          .editCategory(this.category)
          .subscribe((response) => {
            if (response.message == "1") {
              Swal.fire({
                icon: "success",
                text: "Training Course edited with success  !  !",
              });
            } else {
              Swal.fire({
                icon: "error",
                text: "Echec !!",
              });
            }
          });
      }
    } else {
      this.category.coursesId = [];
      this.category.coursesId.push(this.category.coursId);
      this.categoryService
        .addCategory(this.category, this.category.photo)
        .subscribe((response) => {
          if (response.message == "1") {
            Swal.fire({
              icon: "success",
              text: "Trainig Course added with success  !!",
            });
          }
        });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.category.photo = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
