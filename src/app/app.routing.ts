import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddTimeslipComponent} from './add-timeslip/add-timeslip.component';
import {ViewTimeslipComponent} from './view-timeslip/view-timeslip.component';
import {AddCustomdayComponent} from "./add-customday/add-customday.component";
import {ViewProjectsComponent} from './view-projects/view-projects.component';
import {ViewWmbsComponent} from './view-wmbs/view-wmbs.component';

const appRoutes: Routes = [

    {path: 'addtimeslip', component: AddTimeslipComponent},
    {path: 'viewalltimeslips', component: ViewTimeslipComponent},
    {path: "addcustomday",component:AddCustomdayComponent},
    {path: 'viewallprojects', component: ViewProjectsComponent},
    {path: 'viewallwbis', component: ViewWmbsComponent}
];

export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);