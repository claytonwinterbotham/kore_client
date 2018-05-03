import { Component, OnInit } from '@angular/core';
import { MyCustomDayService } from "../services/app.customdayservice";
import { Router, NavigationExtras } from '@angular/router';
import { CustomDayVM } from "../add-customday/add-customday.component"

@Component({
  selector: 'app-createcustomday',
  templateUrl: './createcustomday.component.html',
  styleUrls: ['./createcustomday.component.css']
})
export class CreatecustomdayComponent implements OnInit {
  customDayName: string = "";
  customDayDescription : string = "";
  customdayService : MyCustomDayService;
  createdCustomday : any;
  nameNotEmpty: boolean = true ;
  descriptionNotEmpty : boolean = true;

  constructor(_customdayService : MyCustomDayService,public router:Router) { 
    this.customdayService = _customdayService;
  }

  ngOnInit() {
  }

  createCustomday(){
    console.log("I want to create a new customday");
    if (this.customDayName == "" || this.customDayDescription == ""){
      if (this.customDayName == ""){
        this.nameNotEmpty = false;
      }else {
        this.nameNotEmpty = true;
      }
      if (this.customDayDescription == ""){
        this.descriptionNotEmpty = false;
      }else {
        this.descriptionNotEmpty = true;
      }
      return ;
    }else {
      let customDay : CustomDayVM = {
        Name : this.customDayName,
        Description : this.customDayDescription,
        UserId :  sessionStorage.getItem('userId')
      }
      this.customdayService.create(customDay).subscribe(
        data=>{
          console.log(data);
          this.createdCustomday = data["customDayId"];
  
          console.log("i want to go to another page!");
          this.router.navigate(["/addcustomday",{id:this.createdCustomday,
          name:this.customDayName,description:this.customDayDescription}]);
        },
        error =>{
          alert(error);
        }
      )
    }

  }

}
