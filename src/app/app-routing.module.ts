import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";


const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'admin', loadChildren: () => import('./admin/admin.module').then(m=>m.AdminModule)},
  {path: '', component:HomeComponent},
  {path:'**', component: HomeComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
