import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CoursService {
  coursURL: string = "http://localhost:3000/api/cours";
  constructor(private httpClient: HttpClient) {}

  getAllCours() {
    return this.httpClient.get<{ courses: any; message: string }>(
      this.coursURL
    );
  }
  getAllCoursByTeacherId(teacherId) {
    return this.httpClient.get<{ courses: any; message: string }>(
      `${this.coursURL}/teacher/${teacherId}`
    );
  }
  getCoursById(id) {
    return this.httpClient.get<{ cours: any }>(`${this.coursURL}/${id}`);
  }

  addCours(coursObj, photo: File) {
    let formData = new FormData();
    formData.append("name", coursObj.name);
    formData.append("duration", coursObj.duration);
    formData.append("description", coursObj.description);
    formData.append("teacherId", coursObj.teacherId);
    formData.append("photo", photo);

    return this.httpClient.post<{ message: string }>(this.coursURL, formData);
  }
  editCours(newObj) {
    return this.httpClient.put<{ message: string }>(this.coursURL, newObj);
  }
  deleteCours(id) {
    return this.httpClient.delete<{ message: string }>(
      `${this.coursURL}/${id}`
    );
  }
}
