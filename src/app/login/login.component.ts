import { Component, OnInit } from '@angular/core';
//import { MyUserService } from '../services/app.userservice';
import { MyUserService ,LoginModel} from '../services/app.userservice';
import { routing } from '../app.routing';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

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

    constructor(userDataService: MyUserService,public router:Router, 
                private spinner: NgxSpinnerService) { 
    this._userDataService = userDataService;
  }

  ngOnInit() {
     this.email = "";
     this.password = "";
    
  }

  login(){
   
    // Set our navigation extras object
    // that passes on our global query params and fragment
    let userInfo : LoginModel = {
      Email : this.email,
      Password : this.password
    }
    this.spinner.show();
    this._userDataService.login(userInfo).subscribe(
      data =>{
        sessionStorage.setItem("userId",data["secret"]);
        sessionStorage.setItem("token",data["token"]);
        // console.log(data);
        this.spinner.hide();
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
          };
        
        this.router.navigate(['addtimeslip'],navigationExtras);  
      },
      // Error.
      error => {
          alert(error)
      }
      
    )
  
  }
}
