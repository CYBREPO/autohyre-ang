import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent {

  vehicleForm: FormGroup;
  companies: Array<any> = [];
  models: Array<any> = [];
  locations: any;
  submitted: boolean = false;
  options: any = {
    componentRestrictions: { country: 'NGA' }
  }

  constructor(private httpService: HttpService, private fb: FormBuilder, 
    private modalDialogService: ModalDialogService,public dialogRef: MatDialogRef<QuotesComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getAllCompanies();
    this.initForm();
  }

  initForm() {
    this.vehicleForm = this.fb.group({
      brand: [this.data != null ? this.data.make : '',[Validators.required]],
      model: [this.data != null ? this.data.model : '',[Validators.required]],
      type: [this.data != null ? this.data.type : '',Validators.required],
      pickup: [''],
      drop: [''],
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      information: [''],
    });
  }

  getAllCompanies() {
    this.httpService.httpPost(ApiUrls.brand.getAllBrands, null).subscribe((res: any) => {
      if (res['success']) {
        this.companies = res['data'];
        if(this.data){
          this.getBrandsById();
        }
      }
    });
  }

  close(){
    this.dialogRef.close(null);
  }

  get formControl() {return this.vehicleForm.controls}

  getBrandsById() {
    this.formControl['model'].setValue('');
    this.models = [];
    const brandId = this.companies.find(m => m.name == this.formControl['brand'].value)?._id;
    this.httpService.httpGet(ApiUrls.brand.getBrandById, { id: brandId }).subscribe((res: any) => {
      if (res['success']) {
        this.models = res['data']['models'];
      }
    });
  }

  handleAddressChange(address: Address,type: string) {
    this.locations[type] = {
      address: address.formatted_address,
      latitude: address.geometry.location.lat(),
      longitude: address.geometry.location.lng(),
    }
  }

  submit(){
    this.submitted = true;
    if(this.vehicleForm.invalid) return;

    let param = {
      make: this.formControl['brand'].value,
      model: this.formControl['model'].value,
      type: this.formControl['type'].value,
      pickupDate: this.formControl['startDate'].value,
      dropDate: this.formControl['endDate'].value,
      year: this.data?.year?? "",
      information: this.formControl['information'].value,
      pickupLocation: this.locations != null && this.locations != undefined ? this.locations['pickup']: this.formControl['pickup'].value,
      dropLocation: this.locations != null && this.locations != undefined ? this.locations['drop']: this.formControl['drop'].value,
    }

    this.dialogRef.close(param);
  }
}
