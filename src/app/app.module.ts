import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { NgbModalModule,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalendarUtilsModule } from './calendar-utils/module';
import { HttpModule }    from '@angular/http';
import { RouterModule } from '@angular/router';

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
import { AddCustomdayComponent } from './add-customday/add-customday.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ClickOutsideModule } from 'ng-click-outside';
import {ScrollToModule} from 'ng2-scroll-to';
import { CreatecustomdayComponent } from './createcustomday/createcustomday.component';
import { NgxSpinnerModule } from 'ngx-spinner';

// import { PopupModule} from "ng2-opd-popup";


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
    AddCustomdayComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    CreatecustomdayComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule,
    routing,
    FormsModule,
    NgSelectModule,
    CalendarModule.forRoot(),
    CommonModule,
    NgbModalModule.forRoot(),
    ScrollToModule.forRoot(),
    CalendarUtilsModule,
    HttpModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    // PopupModule.forRoot()
    NgxSpinnerModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
