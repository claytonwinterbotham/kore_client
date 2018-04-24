import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css']
})
export class ViewProjectsComponent implements OnInit {

  clients = [
    { value: 1, label: 'client1' },
    { value: 2, label: 'client2' },
    { value: 3, label: 'client3' },
    { value: 4, label: 'client4' },
    { value: 5, label: 'client5' },
    { value: 6, label: 'client6' }
  ];

  constructor() { }
    start_time;
    end_time;
  ngOnInit() {
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
