import { Component } from '@angular/core';
import { ViewTimeslipComponent } from './view-timeslip/view-timeslip.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import {MyProjectService} from "./services/app.projectservice";
import {MyClientService} from "./services/app.clientservice";
import {MyWBIService} from "./services/app.wbiservice";
import {MyTimeslipService} from "./services/app.timeslipservice"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[
    MyProjectService,
    MyClientService,
    MyWBIService,
    MyTimeslipService
   ]
})
export class AppComponent {
  name = 'Clayton Winterbotham';
}
