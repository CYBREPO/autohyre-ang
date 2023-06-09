import { Component } from '@angular/core';
import { vehicleModels } from 'src/app/constants/constant';
import { DataTransferService } from 'src/app/service/data-transfer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { Address } from 'ngx-google-places-autocomplete/objects/address';



interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  vehicleModels: any;
  // = vehicleModels.vehicleModels
  cardetails: any;
  searchedLocation: string = '';
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom: 14
  }
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
  }

  options: any = {
    componentRestrictions: { country: 'NGA' }
  }  


  constructor(private router: Router, private datatransferService: DataTransferService,
    private activatedRoute: ActivatedRoute, private httpService: HttpService) {
    activatedRoute.params.subscribe(res => {
      if (res['loc']) {
        this.searchedLocation = res['loc'];
      }
    })
  }

  ngOnInit() {
    this.getLocationWiseData();
    // let selectedLocation = this.datatransferService.getData();
    // this.vehicleModels = vehicleModels.vehicleModels.filter(m => selectedLocation.modalIds.toString().includes(m.id));
  }

  getLocationWiseData() {
    if (this.searchedLocation == "") {
      this.httpService.httpPost(ApiUrls.vehicle.getFilteredVehicleDetails, null).subscribe(res => {
        this.vehicleModels = res;
      });
    }
    else {
      let param = {
        address: this.searchedLocation
      }

      this.httpService.httpGet(ApiUrls.location.getLocationVechile, param).subscribe(res => {
        this.vehicleModels = res;
      });
    }

  }

  parentEventHandlerFunction(event: any) {
    this.datatransferService.setData(event);
    this.router.navigate(['/cust/cardetails'])
  }


  foods: Food[] = [
    { value: 'low-to-high-0', viewValue: 'Price: low to high' },
    { value: 'high-to-low-1', viewValue: 'Price: high to low' },
    { value: 'relevance', viewValue: 'Relevance' },
  ];

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  
  handleAddressChange(address: Address) {
    console.log(address.formatted_address)
    console.log(address.geometry.location.lat())
    console.log(address.geometry.location.lng())
  }


}
