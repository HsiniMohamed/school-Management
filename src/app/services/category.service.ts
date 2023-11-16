import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  categoryURL: string = "http://localhost:3000/api/category";

  constructor(private httpClient: HttpClient) {}

  getAllCategories() {
    return this.httpClient.get<{ categories: any; message: string }>(
      this.categoryURL
    );
  }
  getCategoryById(id) {
    return this.httpClient.get<{ category: any }>(`${this.categoryURL}/${id}`);
  }
  getCategoryByIdCourse(id) {
    return this.httpClient.get<{ categories: any }>(
      `${this.categoryURL}/cours/${id}`
    );
  }
  searchCategory(search) {
    return this.httpClient.get<{ categoriesTab: any }>(
      `${this.categoryURL}/research/${search}`
    );
  }
  addCategory(categoryObj, photo: File) {
    let formData = new FormData();
    formData.append("name", categoryObj.name);
    formData.append("duration", categoryObj.duration);
    formData.append("description", categoryObj.description);
    formData.append("coursesId", categoryObj.coursesId);
    formData.append("cost", categoryObj.cost);
    formData.append("photo", photo);

    return this.httpClient.post<{ message: string }>(
      this.categoryURL,
      formData
    );
  }
  editCategory(newObj) {
    return this.httpClient.put<{ message: string }>(this.categoryURL, newObj);
  }
  deleteCategory(id) {
    return this.httpClient.delete<{ message: string }>(
      `${this.categoryURL}/${id}`
    );
  }
}
