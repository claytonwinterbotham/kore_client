import { Component, OnInit } from '@angular/core';
//import { MyUserService } from '../services/app.userservice';
import { MyUserService } from '../services/app.userservice'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MyUserService]
})
export class LoginComponent implements OnInit {

   email: string;
   password: string;
  _userDataService: MyUserService;

    constructor(userDataService: MyUserService) { 
    this._userDataService = userDataService;
  }

  ngOnInit() {
     this.email = "";
     this.password = "";
    
  }

  login(){
    //add logic
    
  }
}
