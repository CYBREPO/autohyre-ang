import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { debounceTime } from 'rxjs';
import { locations, vehicleModels } from 'src/app/constants/constant';
import { ILocation } from 'src/app/interface/locationInterface';
import { DataTransferService } from 'src/app/service/data-transfer.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  searchForm: FormGroup;
  // locations: Array<any> = locations.locations;
  // "Lexus/Toyota","Mercedes Benz/BMW","Acura/Honda","Infiniti/Nissan"
  isLocationLoading: boolean = false;
  options: any = {
    componentRestrictions: { country: 'NGA' }
  }
  selectedLoc: ILocation = {
    "address": "",
    "addressLines": [""],
    "city": "",
    "country": "",
    "latitude": 0,
    "locationSource": "",
    "longitude": 0,
    "precision": {
      "accuracy": 0,
      "level": ""
    },
    "state": "",
    "timeZone": "",
    "postalCode": ""
  };


  constructor(private fb: FormBuilder, private router: Router, private datatransferService: DataTransferService) { }

  ngOnInit(): void {
    this.initForm()
    // this.initiseTypeAhead();
  }

  initForm() {
    this.searchForm = this.fb.group({
      location: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  // initiseTypeAhead() {
  //   this.searchForm.controls['location'].valueChanges.pipe(debounceTime(500)).subscribe(res => {
  //     if (typeof res === "string" && res.length > 0) {
  //       this.isLocationLoading = true;
  //       this.locations = locations.locations.filter(m => m.title.toLowerCase().includes(res.toLowerCase()));
  //       this.isLocationLoading = false;
  //     }
  //   })
  // }

  onSubmit() {
    // let val = this.searchForm.controls['location'].value;
    if (this.selectedLoc) {
      // let selectedLocation = this.locations.find(m => m.title == this.searchForm.controls['location'].value);
      this.datatransferService.setData(this.selectedLoc);
      this.router.navigate(['cust/map',this.selectedLoc.state]);
    }

  }

  handleAddressChange(address: Address) {
    // this.selectedLoc = address;
    address.address_components.forEach(loc => {
      const type = loc.types[0];
      if (type?.toLowerCase() == 'locality') {
        this.selectedLoc.city = loc.long_name;
      }
      if (type?.toLowerCase() == 'administrative_area_level_1') {
        this.selectedLoc.state = loc.long_name;
      }
      if(type?.toLowerCase() == 'administrative_area_level_2'){

      }
      if(type?.toLowerCase() == 'country'){
        this.selectedLoc.country = loc.long_name;
      }
      if(type?.toLowerCase() == 'postal_code'){
        this.selectedLoc.postalCode = loc.long_name;
      }
    });
    this.selectedLoc.address = address.formatted_address;
    this.selectedLoc.latitude = address.geometry.location.lat();
    this.selectedLoc.longitude = address.geometry.location.lng();
    this.selectedLoc.timeZone = address.utc_offset?.toString();

    // console.log(address);
  }

}
