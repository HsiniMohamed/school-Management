import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-search-courses",
  templateUrl: "./search-courses.component.html",
  styleUrls: ["./search-courses.component.css"],
})
export class SearchCoursesComponent implements OnInit {
  searchForm: FormGroup;
  search = { name: "" };
  constructor(private router: Router) {}

  ngOnInit() {}
  searchCourses() {
    window.open(`/sessions-training/${this.search.name}`, "_blank");
  }
}
