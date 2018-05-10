import { Component, OnInit } from '@angular/core';
import { MyUserService, UserModel } from '../services/app.userservice';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MyUserService]
})
export class RegisterComponent implements OnInit {

  newUser: UserModel;

  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;

  _userDataService: MyUserService;

  constructor(userDataService: MyUserService, private router: Router, 
              private spinner: NgxSpinnerService) { 
      this._userDataService = userDataService;
  }

  ngOnInit() {
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.firstName = "";
    this.lastName = "";
  }

  register() {
      let newUser = {
        "UserId": null,
        "Email": this.email,
        "Password": this.password,
        "FirstName": this.firstName,
        "LastName": this.lastName
      }
      this.spinner.show();
      this._userDataService.registerUser(newUser).subscribe(
        data => {
          // console.log(data)
          sessionStorage.setItem("userId",data["secret"]);
          sessionStorage.setItem("token",data["token"]);
          this.spinner.hide();
          this.router.navigate(['addtimeslip'])
        },
        error => {
          this.spinner.hide();
          alert(error)
        },
        //3. execute final instructions
        () => {
          // console.log("Finished")          
        }

      )
  }
}
