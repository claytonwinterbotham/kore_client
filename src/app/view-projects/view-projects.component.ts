import { Router, NavigationExtras } from '@angular/router';
import { MyProjectService } from "../services/app.projectservice";
import  {ProjectModel} from "../services/app.projectservice";
import { MyClientService } from "../services/app.clientservice";
import  {ClientModel} from "../services/app.clientservice";
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css']
})
export class ViewProjectsComponent implements OnInit {
  @ViewChild('projectCreated') projectCreated: TemplateRef<any>;

  projectService : MyProjectService;
  projectList : any;

  projectTypeList : any;
 
  oneProject :any = {};
  newProject : any = {};

  clientService : MyClientService;
  clientList: any;

  constructor(_projectService:MyProjectService, _clientService:MyClientService, 
              private modalService: NgbModal, private spinner: NgxSpinnerService) {
    this.projectService = _projectService;
    this.clientService = _clientService;
   }

    start_time;
    end_time;
  ngOnInit() {
    this.showProjectList();
    this.showClientList()
    this.showProjectTypeList();
  }

  createProject(form: NgForm, project : ProjectModel){
    this.spinner.show();
    this.projectService.postProject(project).subscribe(
      data=> {
        // console.log(data);
        this.spinner.hide();
        this.modalService.open(this.projectCreated);
      },error =>{
        alert(error);
      }
    )
    form.reset();
  }

  showProjectList(){
    this.projectService.getProjects().subscribe(
      data=> {
        // console.log(data);
        this.projectList = data;
      },
    error => {
      alert(error);
    }
  )
  }
  showProjectTypeList(){
    this.projectService.getProjectTypes().subscribe(
      data=> {
        // console.log(data);
        this.projectTypeList = data;
      },
    error => {
      alert(error);
    }
  )
  }

  showClientList(){
    this.clientService.getClients().subscribe(
      data=> {
        // console.log(data);
        this.clientList = data;
      },
    error => {
      alert(error);
    }
  )
  }

  getOneProject(id : string){
    this.projectService.getOneProject(id).subscribe(
      data=> {
        // console.log(data);
        this.oneProject = data;
      },error =>{
        alert(error);
      }
    )
  }
  
  updateProject(project : any){
    this.projectService.updateProject(project).subscribe(
      data=> {
        // console.log(data);
      },error => {
        alert(error);
      }
    )
  }

  deleteOneProject(id : string){
    this.projectService.deleteProject(id).subscribe(
      data=> {
        // console.log(data);
        this.clientList = data;
      },error => {
        alert(error);
      }      
    )
  }
  onClear(form: NgForm){
    form.reset();
  }

}
