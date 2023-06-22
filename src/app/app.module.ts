import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModuleModule } from './layout/layout-module.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpApiInterceptor } from './helper/httpInterceptor';
import { HttpErrorInterceptor } from './helper/httpErrorInterceptor';
import { MaterialModuleModule } from './shared/material-module.module';
import { SharedModuleModule } from './shared/shared-module.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModuleModule,
    HttpClientModule,
    MaterialModuleModule,
    SharedModuleModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpApiInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
