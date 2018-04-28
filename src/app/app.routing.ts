import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddTimeslipComponent} from './add-timeslip/add-timeslip.component';
import {ViewTimeslipComponent} from './view-timeslip/view-timeslip.component';
import {AddCustomdayComponent} from "./add-customday/add-customday.component";
import {ViewProjectsComponent} from './view-projects/view-projects.component';
import {ViewWmbsComponent} from './view-wmbs/view-wmbs.component';
import { HomeComponent } from './home/home.component'; 
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [

    {path: 'addtimeslip', component: AddTimeslipComponent},
    {path: 'viewalltimeslips', component: ViewTimeslipComponent},
    {path: "addcustomday",component:AddCustomdayComponent},
    {path: 'viewallprojects', component: ViewProjectsComponent},
    {path: 'viewallwbis', component: ViewWmbsComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '', redirectTo: 'home', pathMatch: "full"}

];

export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);