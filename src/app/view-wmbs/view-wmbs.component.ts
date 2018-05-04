import { Component, OnInit } from '@angular/core';
import { MyProjectService } from '../services/app.projectservice';
import { MyWBIService } from '../services/app.wbiservice';
import  {WBIModel} from "../services/app.wbiservice";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-wmbs',
  templateUrl: './view-wmbs.component.html',
  styleUrls: ['./view-wmbs.component.css'],
  providers: [
    MyProjectService,
    MyWBIService
  ]
})
export class ViewWmbsComponent implements OnInit {

  projectList: any;
  projectService: MyProjectService;
  wbiService: MyWBIService;
  newWBI : any = {};


  constructor(_projectService: MyProjectService, _wbiService: MyWBIService) { 
    this.projectService = _projectService;
    this.wbiService = _wbiService;
  }

  ngOnInit() {
    this.showProjectList();
  }

  showProjectList(){
    this.projectService.getProjects().subscribe(
      data=> {
        console.log(data);
        this.projectList = data;
      },
    error => {
      alert(error);
    }
  )
  }

  createWBI(form: NgForm, wbi : WBIModel){
    this.wbiService.postWBI(wbi).subscribe(
      data=> {
        console.log(data);
      },error =>{
        alert(error);
      }
    )
    console.log("new wbi" + JSON.stringify(wbi));
    form.reset();

  } 

  onClear(form: NgForm){
    form.reset();
  }

}
