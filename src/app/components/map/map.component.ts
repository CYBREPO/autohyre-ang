import { Component } from '@angular/core';
import { vehicleModels } from 'src/app/constants/constant';
import { DataTransferService } from 'src/app/service/data-transfer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, FormGroup } from '@angular/forms';



interface price {
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
  cardetails: any;
  searchedLocation: string = '';
  selectedLocation: string = '';
  priceSort: price[] = [
    { value: 'low-to-high-0', viewValue: 'Price: low to high' },
    { value: 'high-to-low-1', viewValue: 'Price: high to low' },
    { value: 'relevance', viewValue: 'Relevance' },
  ];
  filterForm: FormGroup;
  companies: Array<any> = [];

  //MAP Options
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom: 14
  }
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
  }
  markers: Array<any> = [];


  options: any = {
    componentRestrictions: { country: 'NGA' }
  }


  constructor(private router: Router, private datatransferService: DataTransferService,
    private activatedRoute: ActivatedRoute, private httpService: HttpService, private fb: FormBuilder) {
    activatedRoute.params.subscribe(res => {
      if (res['loc']) {
        this.searchedLocation = res['loc'];
      }
    })
  }

  ngOnInit() {
    this.initform();
    this.getLocationWiseData();
    this.getAllCompanies();
    this.selectedLocation = this.datatransferService.getData();
    // this.vehicleModels = vehicleModels.vehicleModels.filter(m => selectedLocation.modalIds.toString().includes(m.id));
  }

  initform() {
    this.filterForm = this.fb.group({
      priceSort: [''],
      price: [''],
      make: [''],
      type: ['']
    });
  }

  get frmCrtl() { return this.filterForm.controls }

  getLocationWiseData() {
    let param = {
      priceSort: this.frmCrtl['priceSort'].value,
      price: this.frmCrtl['price'].value,
      make: this.frmCrtl['make'].value,
      type: this.frmCrtl['type'].value,
      location: {}
    }

    if (this.selectedLocation) {
      param['location'] = this.selectedLocation
    }
    else {
      param['location'] = {
        state: this.searchedLocation
      }
    }

    this.httpService.httpPost(ApiUrls.vehicle.getFilteredVehicleDetails, param).subscribe((res: any) => {
      if (res['success'])
        this.vehicleModels = res['data'];
      this.vehicleModels((veh: any) => {
        this.markers.push({
          position: {
            lat: veh.location?.latitude,
            lng: veh.location?.longitude,
          },
          label: {
            color: 'red',
            text: '₦' + veh.price,
          },
          title: '₦ ' + veh.price,
          options: { animation: google.maps.Animation.BOUNCE },
        });
      })

    });

  }

  getAllCompanies() {
    this.httpService.httpPost(ApiUrls.brand.getAllBrands, null).subscribe((res: any) => {
      if (res['success']) {
        this.companies = res['data'];
      }
    });
  }

  parentEventHandlerFunction(event: any) {
    this.datatransferService.setData(event);
    this.router.navigate(['/cust/cardetails'])
  }




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
