import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }

  logOut(){
    sessionStorage.setItem('userId', null);
    sessionStorage.setItem('token',null);
        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };


        this.router.navigate(['login'],navigationExtras);
  }
}

