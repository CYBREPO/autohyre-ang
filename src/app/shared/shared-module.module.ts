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

@NgModule({
  declarations: [SearchBarComponent, CardComponent, CarDetailsCardComponent,ConfirmComponent,CkEditorComponent],
  imports: [
    CommonModule, MaterialModuleModule, ReactiveFormsModule,CKEditorModule
  ],
  exports: [ReactiveFormsModule, SearchBarComponent, CardComponent, CarDetailsCardComponent,ConfirmComponent,CkEditorComponent,
    CKEditorModule]
})
export class SharedModuleModule { }
