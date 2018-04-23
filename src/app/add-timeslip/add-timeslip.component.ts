import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-timeslip',
  templateUrl: './add-timeslip.component.html',
  styleUrls: ['./add-timeslip.component.css']
})
export class AddTimeslipComponent implements OnInit {

  constructor() { }
  tags = [
    { value: 1, label: 'tags1' },
    { value: 2, label: 'tags2' },
    { value: 3, label: 'tags3' },
    { value: 4, label: 'tags4' },
    { value: 5, label: 'tags5' },
    { value: 6, label: 'tags6' }
  ];

  projects = [
    { value: 1, label: 'projects1' },
    { value: 2, label: 'projects2' },
    { value: 3, label: 'projects3' },
    { value: 4, label: 'projects4' },
    { value: 5, label: 'projects5' },
    { value: 6, label: 'projects6' }
  ];

  wbis = [
    { value: 1, label: 'wbis1' },
    { value: 2, label: 'wbis2' },
    { value: 3, label: 'wbis3' },
    { value: 4, label: 'wbis4' },
    { value: 5, label: 'wbis5' },
    { value: 6, label: 'wbis6' }
  ];

  ngOnInit() {
  }
}
