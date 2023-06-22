import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { ComponentsRoutingModuleModule } from './components-routing-module.module';
import { SharedModuleModule } from '../shared/shared-module.module';
import { SingleCarDetailsLayoutComponent } from './single-car-details-layout/single-car-details-layout.component';
import { SingleCategoryCarDetailsComponent } from './single-category-car-details/single-category-car-details.component';
import { MaterialModuleModule } from '../shared/material-module.module';
import { MatSelectModule } from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { QuotesComponent } from './quotes/quotes.component';
import { BecomeAHostComponent } from './become-a-host/become-a-host.component';


@NgModule({
  declarations: [
    MapComponent, SingleCarDetailsLayoutComponent,
    SingleCategoryCarDetailsComponent,QuotesComponent,BecomeAHostComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModuleModule,
    SharedModuleModule,MaterialModuleModule,MatSelectModule,MatSliderModule,
  ]
})
export class ComponentsModuleModule { }
