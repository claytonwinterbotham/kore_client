import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-timeslip',
  templateUrl: './add-timeslip.component.html',
  styleUrls: ['./add-timeslip.component.css']
})
export class AddTimeslipComponent implements OnInit {

  constructor() { }
  projects = [
    { value: 1, label: 'project1' },
    { value: 2, label: 'project2' },
    { value: 3, label: 'project3' }
  ];

  ngOnInit() {
  }
}
