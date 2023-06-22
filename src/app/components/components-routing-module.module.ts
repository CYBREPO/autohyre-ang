import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { RouterModule } from '@angular/router';
import { SingleCarDetailsLayoutComponent } from './single-car-details-layout/single-car-details-layout.component';
import { SingleCategoryCarDetailsComponent } from './single-category-car-details/single-category-car-details.component';
import { CustomerLayoutComponent } from '../page-layout/customer-layout/customer-layout.component';
import { BecomeAHostComponent } from './become-a-host/become-a-host.component';

const routes = [
  {path: "",component: CustomerLayoutComponent,children: [
    {path: "map", component: MapComponent} ,
    {path: "map/:loc", component: MapComponent} ,
    {path: "cardetails", component: SingleCarDetailsLayoutComponent},
    {path: "cardetails/:id", component: SingleCarDetailsLayoutComponent},
    {path: "carcategory", component: SingleCategoryCarDetailsComponent},
    {path: "host", component: BecomeAHostComponent},
    // {path: "carcategory/:make/:type", component: SingleCategoryCarDetailsComponent},
  ]}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ComponentsRoutingModuleModule { }
