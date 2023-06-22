import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
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
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  customHomeOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    nav:true,
    navText: ['next','prev'],
  }


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
        this.vehicleModels.forEach((m: any) => {m.image = environment.url + m.image})
      }
    });
  }


  parentEventHandlerFunction(event: any) {
    this.router.navigate(['/cust/carcategory' ],{ queryParams: { make: event.name }});
  }

  locationEvent(event: any) {
    this.router.navigate(['/cust/map', event.name]);
  }
}
