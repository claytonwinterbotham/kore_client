import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AddTimeslipComponent } from './add-timeslip/add-timeslip.component';
import { ViewTimeslipComponent } from './view-timeslip/view-timeslip.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { routing } from './app.routing';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ViewWmbsComponent } from './view-wmbs/view-wmbs.component';


@NgModule({
  declarations: [
    AppComponent,
    AddTimeslipComponent,
    ViewTimeslipComponent,
    SideBarComponent,
    ViewProjectsComponent,
    ViewWmbsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
