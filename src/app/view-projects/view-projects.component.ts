import { Router, NavigationExtras } from '@angular/router';
import { MyProjectService } from "../services/app.projectservice"
import  {ProjectModel} from "../services/app.projectservice"
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  clients = [
    { value: 1, label: 'client1' },
    { value: 2, label: 'client2' },
    { value: 3, label: 'client3' },
    { value: 4, label: 'client4' },
    { value: 5, label: 'client5' },
    { value: 6, label: 'client6' }
  ];

    start_time;
    end_time;
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

  onSubmit(form: NgForm){
    const value = form.value;
    console.log(
    ` project: ${value.project} 
      client:  ${value.client.label}
      start date: ${new Date(value.start_date.year, value.start_date.month, value.start_date.day)} 
      end date: ${new Date(value.end_date.year, value.end_date.month, value.end_date.day)}   
      project type: ${value.project_type}`)
    form.reset();
  }

  onClear(form: NgForm){
    form.reset();
  }

}
