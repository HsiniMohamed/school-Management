import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-single-instructor",
  templateUrl: "./single-instructor.component.html",
  styleUrls: ["./single-instructor.component.css"],
})
export class SingleInstructorComponent implements OnInit {
  @Input() InstructorInput: any;

  constructor() {}

  ngOnInit() {}
}
