import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MyProjectService } from "../services/app.projectservice"
import  {ProjectModel} from "../services/app.projectservice"
@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css']
})
export class ViewProjectsComponent implements OnInit {

  projectService : MyProjectService;
  projectList : any;
  oneProject :any = {};
  newProject : any = {};

  constructor(_projectService:MyProjectService) {
    this.projectService = _projectService;
   }

  ngOnInit() {
    this.showProjectList();
  }

  createProject(project : ProjectModel){
    this.projectService.postProject(project).subscribe(
      data=> {
        console.log(data);
      },error =>{
        alert(error);
      }
    )
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

  getOneProject(id : string){
    this.projectService.getOneProject(id).subscribe(
      data=> {
        console.log(data);
        this.oneProject = data;
      },error =>{
        alert(error);
      }
    )
  }

  updateProject(project : any){
    this.projectService.updateProject(project).subscribe(
      data=> {
        console.log(data);
      },error => {
        alert(error);
      }
    )
  }

  deleteOneProject(id : string){
    this.projectService.deleteProject(id).subscribe(
      data=> {
        console.log(data);
      },error => {
        alert(error);
      }      
    )
  }

}
