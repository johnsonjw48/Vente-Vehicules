import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./admin/dashboard/dashboard.component";

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'admin/dashboard', component:DashboardComponent},
  {path: '', component:HomeComponent},
  {path:'**', component: HomeComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
