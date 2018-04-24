import { Component } from '@angular/core';
import { ViewTimeslipComponent } from './view-timeslip/view-timeslip.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import {MyProjectService} from "./services/app.projectservice"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[MyProjectService]
})
export class AppComponent {
  name = 'Clayton Winterbotham';
}
