import { Component, OnInit,ViewChild, TemplateRef } from '@angular/core';
import { MyProjectService } from '../services/app.projectservice';
import { MyWBIService } from '../services/app.wbiservice';
import  {WBIModel} from "../services/app.wbiservice";
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

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
  @ViewChild('wbiCreated') wbiCreated: TemplateRef<any>;

  projectList: any;
  projectService: MyProjectService;
  wbiService: MyWBIService;
  newWBI : any = {};


  constructor(_projectService: MyProjectService, _wbiService: MyWBIService, 
              private modalService: NgbModal, private spinner: NgxSpinnerService) { 
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
    this.spinner.show();
    this.wbiService.postWBI(wbi).subscribe(
      data=> {
        console.log(data);
        this.spinner.hide();
        this.modalService.open(this.wbiCreated);
      },error =>{
        alert(error);
      }
    )
    form.reset();

  } 

  onClear(form: NgForm){
    form.reset();
  }

}
