import { Component, OnInit } from '@angular/core';
import { MyUserService, UserModel } from '../services/app.userservice';
import { Router } from '@angular/router';

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

  constructor(userDataService: MyUserService, private router: Router) { 
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
      this._userDataService.registerUser(newUser).subscribe(
        data => {
          console.log(data)
          this.router.navigate(['home'])
        },
        error => {
          alert(error)
        },
        //3. execute final instructions
        () => {
          console.log("Finished")          
        }

      )
  }
}
