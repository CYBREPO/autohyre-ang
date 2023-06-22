import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { IUser } from 'src/app/interface/userInterface';
import { HttpService } from 'src/app/service/http.service';
import { UserInfoService } from 'src/app/service/user-info.service';

@Component({
  selector: 'app-become-a-host',
  templateUrl: './become-a-host.component.html',
  styleUrls: ['./become-a-host.component.scss']
})
export class BecomeAHostComponent {

  hostform: FormGroup;
  carFiles: FileList;
  submitted: boolean = false;
  user: IUser;


  constructor(private fb: FormBuilder, private httpService: HttpService, private userInfoService: UserInfoService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = this.userInfoService.getLoggedInUser()
    this.initForm();
    if (this.user == null || this.user == undefined) {
      this.logout();
    }
  }



  initForm() {
    this.hostform = this.fb.group({
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required]],
      vin: ['', [Validators.required]],

      ownerName: ['', [Validators.required]],
      ownerMobile: ['', [Validators.required]],
      ownerProfile: ['', [Validators.required]],
      sameDriver: [false],

      driverName: ['', []],
      drivingLicense: ['', [Validators.required]],
      driverMobile: ['', []],
      driverProfile: ['', []],

      goals: ['', [Validators.required]],
      carAvailability: ['', [Validators.required]],
      photos: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      safetyQuantity: ['', [Validators.required]],

      airBags: [false],
      fireExtinguisher: [false],
      cCaution: [false],
      umbrella: [false],
    })
  }


  handleFileInput(event: any): void {
    this.carFiles = event?.target?.files;
  }

  handleFileInputProfile(event: any, type: string): void {
    this.hostform.controls[type].setValue(event?.target?.files[0]);
  }

  fillDriver() {

    if (this.hostform.controls['sameDriver'].value) {
      this.hostform.patchValue({
        driverName: this.hostform.controls["ownerName"].value,
        driverMobile: this.hostform.controls["ownerMobile"].value,
        driverProfile: this.hostform.controls["ownerProfile"].value,
      });
      this.hostform.controls['driverName'].disable();
      this.hostform.controls['driverMobile'].disable();
      this.hostform.controls['driverProfile'].disable();
    }
    else {
      this.hostform.enable();
    }

  }

  becomeHost() {
    this.submitted = true;

    if (this.hostform.invalid) return;

    let formdata = new FormData;
    formdata.append(`make`, this.hostform.controls['make'].value);
    formdata.append(`model`, this.hostform.controls['model'].value);
    formdata.append(`year`, this.hostform.controls['year'].value);
    formdata.append(`vin`, this.hostform.controls['vin'].value);

    formdata.append(`ownerName`, this.hostform.controls['ownerName'].value);
    formdata.append(`ownerMobile`, this.hostform.controls['ownerMobile'].value);
    formdata.append(`ownerProfile`, this.hostform.controls['ownerProfile'].value);

    formdata.append(`driverName`, this.hostform.controls['driverName'].value);
    formdata.append(`drivingLicense`, this.hostform.controls['drivingLicense'].value);
    formdata.append(`driverMobile`, this.hostform.controls['driverMobile'].value);
    formdata.append(`driverProfile`, this.hostform.controls['driverProfile'].value);

    formdata.append(`goals`, this.hostform.controls['goals'].value);
    formdata.append(`carAvailability`, this.hostform.controls['carAvailability'].value);
    formdata.append(`bankName`, this.hostform.controls['bankName'].value);
    formdata.append(`accountName`, this.hostform.controls['accountName'].value);
    formdata.append(`accountNumber`, this.hostform.controls['accountNumber'].value);
    formdata.append(`safetyQuantity`, this.hostform.controls['safetyQuantity'].value);

    formdata.append(`airBags`, this.hostform.controls['airBags'].value);
    formdata.append(`fireExtinguisher`, this.hostform.controls['fireExtinguisher'].value);
    formdata.append(`cCaution`, this.hostform.controls['cCaution'].value);
    formdata.append(`umbrella`, this.hostform.controls['umbrella'].value);
    formdata.append(`sameDriver`, this.hostform.controls['sameDriver'].value);

    for (let i = 0; i < this.carFiles.length; i++) {
      formdata.append(`carPhotos`, this.carFiles[i]);
    }

    this.httpService.httpPostFormData(ApiUrls.host.createHost, formdata).subscribe(res => { })
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['account/login']);
  }
}
