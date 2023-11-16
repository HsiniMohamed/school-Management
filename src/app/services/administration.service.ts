import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AdministrationService {
  administrationURL: string = "http://localhost:3000/api/administration";

  constructor(private httpClient: HttpClient) {}
  getQuotes() {
    return this.httpClient.get<{ quotes: any; message: string }>(
      this.administrationURL + "/quotes"
    );
  }
  getQuoteById(id) {
    return this.httpClient.get<{ quote: any }>(
      `${this.administrationURL}/quotes${id}`
    );
  }
  askForaQuote(obj) {
    return this.httpClient.post<{ message: string }>(
      this.administrationURL + "/ask-quote",
      obj
    );
  }
  sendResponseForQuote(responseObj) {
    return this.httpClient.post<{ message: string }>(
      this.administrationURL + "/send-response-quote",
      responseObj
    );
  }
  // editStatusQuote(quoteId) {
  //   return this.httpClient.put<{ message: string }>(
  //     this.administrationURL,
  //     quoteId
  //   );
  // }
  requestForAnInvoice(obj) {
    return this.httpClient.post<{ message: string }>(
      this.administrationURL + "/request-invoice",
      obj
    );
  }
  sendInvoice(responseObj) {
    return this.httpClient.post<{ message: string }>(
      this.administrationURL + "/send-invoice",
      responseObj
    );
  }
  getAllPayements() {
    return this.httpClient.get<{ payements: any; message: string }>(
      this.administrationURL + "/payements"
    );
  }
  getPayementById(id) {
    return this.httpClient.get<{ payement: any }>(
      `${this.administrationURL}/payements/${id}`
    );
  }
  getPaymentByIdStudent(idStudent, idGroup) {
    return this.httpClient.get<{ payement: any }>(
      `${this.administrationURL}/payements/students/${idStudent}/${idGroup}`
    );
  }
  getAllPaymentsByIdStudent(id) {
    return this.httpClient.get<{ payements: any }>(
      `${this.administrationURL}/payements/students/${id}`
    );
  }

  makePayement(obj) {
    return this.httpClient.post<{ message: string }>(
      this.administrationURL + "/payement",
      obj
    );
  }
  updatePayement(updateObj) {
    return this.httpClient.put<{ message: string }>(
      this.administrationURL + "/payement",
      updateObj
    );
  }
}
