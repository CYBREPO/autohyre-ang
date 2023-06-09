import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { GridActionType, GridColumnDataType, GridColumnType, Pagination, fuel } from 'src/app/constants/constant';
import { ILocation } from 'src/app/interface/locationInterface';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';

@Component({
  selector: 'app-manage-cars',
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.scss']
})
export class ManageCarsComponent {

  companies: Array<any> = [];
  models: Array<any> = [];
  vehicles: Array<any> = [];
  columns: Array<{
    title: string, dataField: string, type: string, dataType?: string, rowChild?: { component: any, show: boolean }, sort?: boolean,
    actions?: Array<{ event: string, type: string, title: string, class: string, conditionalDisplay?: { dataField: string, value: any } }>
  }> = [];
  totalCount: number;
  pageIndex: number = 1;
  pageSize = Pagination.PageSize;

  vehicleForm: FormGroup;
  fileData: FileList;
  fuel = fuel.fuelUnits;
  fuelTypes = fuel.fuelTypes;
  submitted: boolean = false;
  isLoading: boolean = false;
  searchText: string = "";
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
  options: any = {
    types: ['address'],
    componentRestrictions: { country: 'NGA' }

  } as unknown as Options;

  // @ViewChild("placesRef") placesRef!: GooglePlaceDirective;

  @ViewChild('modalBtn') modalBtn: ElementRef;

  constructor(private httpService: HttpService, private fb: FormBuilder, private modalDialogService: ModalDialogService) { }

  ngOnInit() {
    this.setColums();
    this.getAllCompanies();
    this.getAllVehicles();
    this.initForm();
  }

  initForm() {
    this.vehicleForm = this.fb.group({
      id: [''],
      description: ['', [Validators.required]],
      files: [''],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      price: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      fuelType: ['', [Validators.required]],
      type: ['', [Validators.required]],
      fuelUnit: ['', [Validators.required]],
      fuelGrade: ['', [Validators.required]],
      doors: ['', [Validators.required]],
      seats: ['', [Validators.required]],
      year: ['', [Validators.required]],
      vin: ['', [Validators.required]],
      vehicleDetailsId: [""],
      location: [''],


      featureId: [""],
      ageBook: [false],
      automaticTransmission: [false],
      AllWheelDrive: [false],
      appleCarPlay: [false],
      androidAuto: [false],
      auxInput: [false],
      backupCamera: [false],
      bluetooth: [false],
      childSeat: [false],
      heatedSeats: [false],
      keylessEntry: [false],
      sunRoof: [false],
      tollPass: [false],
      usbCharger: [false],
      usbInput: [false],
    });
  }

  get formControl() {
    return this.vehicleForm.controls;
  }

  handleFileInput(event: any): void {
    this.fileData = event?.target?.files;
  }

  setColums() {
    this.columns = [
      { title: 'Car Company', dataField: 'make', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Model', dataField: 'model', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Type', dataField: 'type', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Year', dataField: 'year', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      {
        title: 'Action', dataField: '', type: GridColumnType.ACTION, actions: [
          { title: "edit", event: "edit", type: GridActionType.ICON, class: "fa fa-pencil" },
          { title: "delete", event: "delete", type: GridActionType.ICON, class: "fa fa-trash" },
        ]
      }
    ]
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

  getAllCompanies() {
    this.httpService.httpPost(ApiUrls.brand.getAllBrands, null).subscribe((res: any) => {
      if (res['success']) {
        this.companies = res['data'];
      }
    });
  }

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

  getAllVehicles() {
    let param = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText
    }
    this.httpService.httpPost(ApiUrls.vehicle.getVehicles, param).subscribe((res: any) => {
      if (res['success']) {
        this.vehicles = res['data'];
        this.totalCount = res['count'];
      }
    })
  }

  paginationEventHandler(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getAllVehicles();
  }

  gridEvent(evt: any) {
    if (evt.event == "delete") {
      const dialogRef = this.modalDialogService.openDialog({
        title: "Delete Vehicle",
        message: "Are you sure you want to delete this Vehicle!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      })
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpGet(ApiUrls.vehicle.deleteVehicle, { id: evt.data._id }).subscribe((res: any) => {
            if (res['success']) {
              this.getAllVehicles();
            }
          });
        }
      });
    }
    if (evt.event == 'edit') {
      this.modalBtn.nativeElement.click();
      this.vehicleForm.patchValue({
        id: evt['data']['_id'],
        brand: evt['data']['make'],
        model: evt['data']['model'],
        price: evt['data']['price'],
        type: evt['data']['type'],
        year: evt['data']['year'],
        vin: evt['data']['vin'],
        location: evt['data']['location']['address']

      });
      this.selectedLoc = evt['data']['location'];
      this.getBrandsById();
      this.vehicleForm.patchValue({
        model: evt['data']['model'],
      });
      this.getVehicleDetails(evt.data._id);
    }
  }

  submit() {
    this.submitted = true;

    if (this.vehicleForm.invalid)
      return;

    const formData: FormData = new FormData();
    formData.append(`description`, this.formControl['description'].value);
    formData.append(`id`, this.formControl['id'].value);
    formData.append(`vehicleDetailsId`, this.formControl['vehicleDetailsId'].value);
    formData.append(`featureId`, this.formControl['featureId'].value);
    formData.append(`listingCreatedTime`, "");
    formData.append(`make`, this.formControl['brand'].value);
    formData.append(`vin`, this.formControl['vin'].value);
    formData.append(`marketAreaId`, "");
    formData.append(`marketCountry`, "");
    formData.append(`model`, this.formControl['model'].value);
    formData.append(`name`, "");
    formData.append(`registration`, "");
    formData.append(`averageFuelEconomy`, this.formControl['mileage'].value);
    formData.append(`fuelUnit`, this.formControl['fuelUnit'].value);
    formData.append(`fuelUnitLabel`, this.fuel.find(m => m.unit == this.formControl['fuelUnit'].value)?.label ?? "");
    formData.append(`type`, this.formControl['type'].value);
    formData.append(`fuelGrade`, this.formControl['fuelGrade'].value);
    formData.append(`numberOfDoors`, this.formControl['doors'].value);
    formData.append(`numberOfSeats`, this.formControl['seats'].value);
    formData.append(`year`, this.formControl['year'].value);
    formData.append(`price`, this.formControl['price'].value);
    formData.append(`fuelType[label]`, this.formControl['fuelType'].value);
    formData.append(`fuelType[value]`, this.fuelTypes.find(m => m.label == this.formControl['fuelType'].value)?.value ?? "");

    formData.append(`ageBook`, this.formControl['ageBook'].value ?? false);
    formData.append(`automaticTransmission`, this.formControl['automaticTransmission'].value ?? false);
    formData.append(`AllWheelDrive`, this.formControl['AllWheelDrive'].value ?? false);
    formData.append(`appleCarPlay`, this.formControl['appleCarPlay'].value ?? false);
    formData.append(`androidAuto`, this.formControl['androidAuto'].value ?? false);
    formData.append(`auxInput`, this.formControl['auxInput'].value ?? false);
    formData.append(`backupCamera`, this.formControl['backupCamera'].value ?? false);
    formData.append(`bluetooth`, this.formControl['bluetooth'].value ?? false);
    formData.append(`childSeat`, this.formControl['childSeat'].value ?? false);
    formData.append(`heatedSeats`, this.formControl['heatedSeats'].value ?? false);
    formData.append(`keylessEntry`, this.formControl['keylessEntry'].value ?? false);
    formData.append(`sunRoof`, this.formControl['sunRoof'].value ?? false);
    formData.append(`tollPass`, this.formControl['tollPass'].value ?? false);
    formData.append(`usbCharger`, this.formControl['usbCharger'].value ?? false);
    formData.append(`usbInput`, this.formControl['usbInput'].value ?? false);
    formData.append(`location`, JSON.stringify(this.selectedLoc));


    for (let i = 0; i < this.fileData?.length; i++) {
      formData.append(`images`, this.fileData[i]);
    }

    let api = ApiUrls.vehicle.setVehicleDetails;
    if(this.formControl['id'].value && this.formControl['id'].value != ""){
      api = ApiUrls.vehicle.updateVehicleDetails;
    }
    this.httpService.httpPostFormData(api, formData).subscribe((res: any) => {
      if (res['success']) {
        this.modalBtn.nativeElement.click();
        this.vehicleForm.reset();
        this.getAllVehicles();
      }

    });

  }

  getVehicleDetails(id: string) {
    
    this.httpService.httpGet(ApiUrls.vehicle.getAdditionDetails + "?id=" + id, null).subscribe((res: any) => {
      if (res['success']) {
        this.vehicleForm.patchValue({
          description: res['data']['basicDetails']['description'],
          fuelUnit: res['data']['basicDetails']['fuelUnit'],
          fuelGrade: res['data']['basicDetails']['fuelGrade'],
          doors: res['data']['basicDetails']['numberOfDoors'],
          seats: res['data']['basicDetails']['numberOfSeats'],
          mileage: res['data']['basicDetails']['averageFuelEconomy'],
          fuelType: res['data']['basicDetails']['fuelType']['label'],
          vehicleDetailsId: res['data']['basicDetails']['_id'],

          featureId: res['data']['features']['_id'],
          ageBook: res['data']['features']['ageBook'],
          automaticTransmission: res['data']['features']['automaticTransmission'],
          AllWheelDrive: res['data']['features']['AllWheelDrive'],
          appleCarPlay: res['data']['features']['appleCarPlay'],
          androidAuto: res['data']['features']['androidAuto'],
          auxInput: res['data']['features']['auxInput'],
          backupCamera: res['data']['features']['backupCamera'],
          bluetooth: res['data']['features']['bluetooth'],
          childSeat: res['data']['features']['childSeat'],
          heatedSeats: res['data']['features']['heatedSeats'],
          keylessEntry: res['data']['features']['keylessEntry'],
          sunRoof: res['data']['features']['sunRoof'],
          tollPass: res['data']['features']['tollPass'],
          usbCharger: res['data']['features']['usbCharger'],
          usbInput: res['data']['features']['usbInput'],
        });
      }
    });
  }
}
