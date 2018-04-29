import { Component, OnInit } from '@angular/core';
//import { MyUserService } from '../services/app.userservice';
import { MyUserService } from '../services/app.userservice';
import { routing } from '../app.routing';
import { Router, NavigationExtras } from '@angular/router';
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

    constructor(userDataService: MyUserService,public router:Router) { 
    this._userDataService = userDataService;
  }

  ngOnInit() {
     this.email = "";
     this.password = "";
    
  }

  login(){
    //add logic
    // Set our navigation extras object
    // that passes on our global query params and fragment
    let navigationExtras: NavigationExtras = {
        queryParamsHandling: 'preserve',
        preserveFragment: true
        };


    this.router.navigate(['addtimeslip'],navigationExtras);    
  }
}
