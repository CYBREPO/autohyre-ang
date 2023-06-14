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

@NgModule({
  declarations: [SearchBarComponent, CardComponent, CarDetailsCardComponent,ConfirmComponent,CkEditorComponent,AlertComponent],
  imports: [
    CommonModule, MaterialModuleModule, ReactiveFormsModule,CKEditorModule
  ],
  entryComponents: [AlertComponent],
  exports: [ReactiveFormsModule, SearchBarComponent, CardComponent, CarDetailsCardComponent,ConfirmComponent,CkEditorComponent,
    CKEditorModule,AlertComponent]
})
export class SharedModuleModule { }
