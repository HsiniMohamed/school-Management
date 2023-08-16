import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserService {
  userURL: string = "http://localhost:3000/api/users";

  constructor(private httpClient: HttpClient) {}
  //Signup Begin
  signup(
    userObj: any,
    file1: File | null,
    fileType1: string,
    file2: File | null,
    fileType2: string
  ) {
    const formData = new FormData();
    formData.append("firstName", userObj.firstName);
    formData.append("lastName", userObj.lastName);
    formData.append("phone", userObj.phone);
    formData.append("adresse", userObj.adresse);
    formData.append("email", userObj.email);
    formData.append("pwd", userObj.pwd);
    formData.append("role", userObj.role);
    formData.append("validity", userObj.validity);

    if (file1) {
      formData.append(fileType1, file1);
    }

    if (file2) {
      formData.append(fileType2, file2);
    }

    let endpoint = "";
    if (fileType1 === "photo") {
      endpoint = "/signup/student";
    } else if (fileType1 === "cv") {
      endpoint = "/signup/teacher";
    } else if (fileType1 === "") {
      endpoint = "/signup/admin";
    } else {
      // Handle other file types or errors here
      return;
    }

    return this.httpClient.post<{ message: string }>(
      this.userURL + endpoint,
      formData
    );
  }
  signupAdmin(userObj: any) {
    return this.httpClient.post<{ message: string }>(
      this.userURL + "/signup/admin",
      userObj
    );
  }
  signupStudent(userObj: any, photo: File) {
    return this.signup(userObj, photo, "photo", null, "");
  }
  signupTeacher(userObj: any, cv: File, photo: File) {
    return this.signup(userObj, cv, "cv", photo, "photo");
  }
  //Signup End

  //Login Begin
  login(userObj) {
    return this.httpClient.post<{ user: any; msg: string }>(
      this.userURL + "/login",
      userObj
    );
  }
  //Login End
  //Reset Password BEgin
  resetPassword(email: string) {
    return this.httpClient.post<{ message: string }>(
      this.userURL + "/forgot-password",
      email
    );
  }
  //Reset Password End
  getUserById(id) {
    return this.httpClient.get<{ user: any }>(`${this.userURL}/${id}`);
  }
  editUser(obj) {
    return this.httpClient.put<{ message: string }>(this.userURL, obj);
  }
}
