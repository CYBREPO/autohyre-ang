import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrls } from 'src/app/constants/apiRoutes';

import { DataTransferService } from 'src/app/service/data-transfer.service';
import { HttpService } from 'src/app/service/http.service';
@Component({
  selector: 'app-single-category-car-details',
  templateUrl: './single-category-car-details.component.html',
  styleUrls: ['./single-category-car-details.component.scss']
})
export class SingleCategoryCarDetailsComponent {

  cardetails: any;
  makeType: string;


  constructor(private router: Router, private datatransferService: DataTransferService,
    private activatedRoute: ActivatedRoute, private httpService: HttpService) {
    activatedRoute.params.subscribe(param => {
      if (param['make']) {
        this.makeType = param['make'];
      }
    })
  }


  ngOnInit(): void {
    this.getPopularVehicles();
    // this.cardetails = this.datatransferService.getData();

  }

  getPopularVehicles() {
    let param = {
      make: this.makeType
    }
    this.httpService.httpPost(ApiUrls.vehicle.getFilteredVehicleDetails, param).subscribe((res: any) => {
      if (res['success'])
        this.cardetails = res['data'];
    })
  }

  parentEventHandlerFunction(event: any) {
    // this.datatransferService.setData(event);
    this.router.navigate(['/cust/cardetails', event._id])
  }
}



