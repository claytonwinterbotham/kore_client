import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarUtilsModule } from './calendar-utils/module';


import { AppComponent } from './app.component';
import { AddTimeslipComponent } from './add-timeslip/add-timeslip.component';
import { ViewTimeslipComponent } from './view-timeslip/view-timeslip.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routing } from './app.routing';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ViewWmbsComponent } from './view-wmbs/view-wmbs.component';
import { NgbdDatepickerPopup } from './widgets/datepicker-popup/datepicker-popup';
import { NgbdTimepickerMeridian } from './widgets/timepicker/timepicker';




@NgModule({
  declarations: [
    AppComponent,
    AddTimeslipComponent,
    ViewTimeslipComponent,
    SideBarComponent,
    ViewProjectsComponent,
    ViewWmbsComponent,
    NgbdDatepickerPopup,
    NgbdTimepickerMeridian,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    routing,
    FormsModule,
    NgSelectModule,
    CalendarModule.forRoot(),
    CommonModule,
    NgbModalModule.forRoot(),
    CalendarUtilsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
