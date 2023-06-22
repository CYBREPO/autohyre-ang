import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { locations, vehicleModels } from 'src/app/constants/constant';
import { DataTransferService } from 'src/app/service/data-transfer.service';
import { HttpService } from 'src/app/service/http.service';
import { LoaderService } from 'src/app/service/loader.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  vehicleModels: any;
  // = vehicleModels.vehicleModels;
  locations = locations.locations;
  page: any;
  domain: string = environment.url;

  constructor(private router: Router,private httpservice: HttpService) { }

  ngOnInit() {
    this.locations = locations.locations;
    this.getHomePage();
    this.getBrands();

  }

  getHomePage(){
    this.httpservice.httpGet(ApiUrls.pages.getHome, null).subscribe((res: any) => {
      if (res['success']) {
        this.page = res['data'];
      }
    });
  }

  getBrands() {
    this.httpservice.httpPost(ApiUrls.brand.getAllBrands, null).subscribe((res: any) => {
      if (res['success']) {
        this.vehicleModels = res['data'];
      }
    });
  }


  parentEventHandlerFunction(event: any) {
    this.router.navigate(['/cust/carcategory' ],{ queryParams: { make: event.name }});
  }

  locationEvent(event: any) {
    this.router.navigate(['/cust/map', event.title]);
  }
}
