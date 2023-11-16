import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  //declaration de destination du serveur

  groupURL: string = "http://localhost:3000/api/groups";
  constructor(private httpClient: HttpClient) {}
  getAllGroupes() {
    return this.httpClient.get<{ groups: any; message: string }>(this.groupURL);
  }
  getGroupeById(id) {
    return this.httpClient.get<{ group: any }>(`${this.groupURL}/${id}`);
  }
  getGroupeByIdTeacher(id) {
    return this.httpClient.get<{ group: any }>(
      `${this.groupURL}/teachers/${id}`
    );
  }
  getGroupeByIdStudent(id) {
    return this.httpClient.get<{ group: any }>(
      `${this.groupURL}/students/${id}`
    );
  }
  getClassesByIdStudent(id) {
    return this.httpClient.get<{ groups: any }>(
      `${this.groupURL}/students/classes/${id}`
    );
  }
  getGroupeByIdCategory(id) {
    return this.httpClient.get<{ group: any }>(
      `${this.groupURL}/category/${id}`
    );
  }

  addGroupe(groupObj) {
    return this.httpClient.post<{ message: string }>(this.groupURL, groupObj);
  }
  editGroup(newObj) {
    return this.httpClient.put<{ message: string }>(this.groupURL, newObj);
  }
  deleteGroup(id) {
    return this.httpClient.delete<{ message: string }>(
      `${this.groupURL}/${id}`
    );
  }
}
