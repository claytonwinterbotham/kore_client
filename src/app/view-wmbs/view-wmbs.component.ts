import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-wmbs',
  templateUrl: './view-wmbs.component.html',
  styleUrls: ['./view-wmbs.component.css']
})
export class ViewWmbsComponent implements OnInit {

  projects = [
    { value: 1, label: 'projects1' },
    { value: 2, label: 'projects2' },
    { value: 3, label: 'projects3' },
    { value: 4, label: 'projects4' },
    { value: 5, label: 'projects5' },
    { value: 6, label: 'projects6' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
