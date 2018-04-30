import { Component, OnInit } from '@angular/core';
import { MyProjectService } from '../services/app.projectservice';

@Component({
  selector: 'app-view-wmbs',
  templateUrl: './view-wmbs.component.html',
  styleUrls: ['./view-wmbs.component.css'],
  providers: [MyProjectService]
})
export class ViewWmbsComponent implements OnInit {

  projectList: any;
  projectService: MyProjectService;
  // projects = [
  //   { value: 1, label: 'projects1' },
  //   { value: 2, label: 'projects2' },
  //   { value: 3, label: 'projects3' },
  //   { value: 4, label: 'projects4' },
  //   { value: 5, label: 'projects5' },
  //   { value: 6, label: 'projects6' }
  // ];
  selectedProject : string;

  constructor(_projectService: MyProjectService) { 
    this.projectService = _projectService;
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

}
