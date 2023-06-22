import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from './material-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CardComponent } from './card/card.component';
import { CarDetailsCardComponent } from './car-details-card/car-details-card.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { CkEditorComponent } from './ck-editor/ck-editor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AlertComponent } from './alert/alert.component';
import { HostDetailsComponent } from './host-details/host-details.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [SearchBarComponent, CardComponent, CarDetailsCardComponent,ConfirmComponent,CkEditorComponent,AlertComponent,
    HostDetailsComponent],
  imports: [
    CommonModule, MaterialModuleModule, ReactiveFormsModule,CKEditorModule,
    GoogleMapsModule,GooglePlaceModule,CarouselModule 
  ],
  entryComponents: [AlertComponent],
  exports: [ReactiveFormsModule, SearchBarComponent, CardComponent, CarDetailsCardComponent,ConfirmComponent,CkEditorComponent,
    CKEditorModule,AlertComponent,HostDetailsComponent,GoogleMapsModule,GooglePlaceModule,CarouselModule ]
})
export class SharedModuleModule { }
