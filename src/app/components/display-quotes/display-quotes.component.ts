import { Component, OnInit } from "@angular/core";
import { AdministrationService } from "src/app/services/administration.service";
import { CategoryService } from "src/app/services/category.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-quotes",
  templateUrl: "./display-quotes.component.html",
  styleUrls: ["./display-quotes.component.css"],
})
export class DisplayQuotesComponent implements OnInit {
  quotes = [];
  constructor(
    private administrationService: AdministrationService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.getAll();
  }
  sendReply(idQuote) {
    let quote = this.quotes.find((element) => element._id == idQuote);
    quote.state = "Answered";
    console.log(quote);

    this.administrationService
      .sendResponseForQuote(quote)
      .subscribe((response) => {
        if (response.message == "1") {
          Swal.fire({
            title: "The response was sent successfully !!",
            showConfirmButton: false,
            icon: "success",
          });
          this.getAll();
        } else {
          Swal.fire({
            title: "Error !!",
            showConfirmButton: false,
            icon: "warning",
          });
        }
      });
  }
  getAll() {
    this.administrationService.getQuotes().subscribe((response) => {
      this.quotes = response.quotes;
      for (let i = 0; i < this.quotes.length; i++) {
        this.categoryService
          .getCategoryById(this.quotes[i].categoryId)
          .subscribe((res) => {
            this.quotes[i].categoryName = res.category.name;
            this.quotes[i].categoryPrice = res.category.cost;
            if (this.quotes[i].planingOption == "Evening") {
              this.quotes[i].description =
                "Evening course times are as follows: 2 hours per day, Monday to Friday from 6 p.m. to 9 p.m. for 6 months";
            } else {
              this.quotes[i].description =
                "The daily course schedules are as follows: 4 hours per day, Monday to Friday from 9 a.m. to 1 p.m. for 4 months";
            }
          });
      }
    });
  }
  // stateStyle(state) {
  //   if (state == "Pending") {
  //     return "pending";
  //   } else {
  //     return "answered";
  //   }
  // }
}
