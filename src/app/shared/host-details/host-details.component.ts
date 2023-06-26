import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interface/userInterface';
import { HttpService } from 'src/app/service/http.service';
import { UserInfoService } from 'src/app/service/user-info.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';

@Component({
  selector: 'app-host-details',
  templateUrl: './host-details.component.html',
  styleUrls: ['./host-details.component.scss']
})
export class HostDetailsComponent {

  hostform: FormGroup;
  // carFiles: FileList;
  // profile: File;
  user: IUser;
  statusClass: string;


  constructor(private fb: FormBuilder, private httpService: HttpService, private userInfoService: UserInfoService,
    private router: Router, public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private modalDialogService: ModalDialogService) { }

  ngOnInit(): void {
    this.user = this.userInfoService.getLoggedInUser()
    this.initForm();
  }

  initForm() {
    this.hostform = this.fb.group({
      make: [this.data != null ? this.data.make : ''],
      model: [this.data != null ? this.data.model : ''],
      year: [this.data != null ? this.data.year : ''],
      vin: [this.data != null ? this.data.vin : ''],

      ownerName: [this.data != null ? this.data.ownerName : ''],
      ownerMobile: [this.data != null ? this.data.ownerMobile : ''],
      ownerProfile: [this.data != null ? this.data.ownerProfile : ''],
      // sameDriver: [this.data != null ? this.data.car : ''],

      driverName: [this.data != null ? this.data.driverDetails.driverName : ''],
      drivingLicense: [this.data != null ? this.data.driverDetails.drivingLicense : ''],
      driverMobile: [this.data != null ? this.data.driverDetails.driverMobile : ''],
      driverProfile: [this.data != null ? this.data.driverDetails.driverProfile : ''],

      goals: [this.data != null ? this.data.goals : ''],
      carAvailability: [this.data != null ? this.data.carAvailability : ''],
      photos: [this.data != null ? this.data.photos : ''],
      bankName: [this.data != null ? this.data.payout.bankName : ''],
      accountName: [this.data != null ? this.data.payout.accountName : ''],
      accountNumber: [this.data != null ? this.data.payout.accountNumber : ''],
      safetyQuantity: [this.data != null ? this.data.safetyQuantity : ''],

      airBags: [this.data != null ? this.data.airBags : ''],
      fireExtinguisher: [this.data != null ? this.data.fireExtinguisher : ''],
      cCaution: [this.data != null ? this.data.cCaution : ''],
      umbrella: [this.data != null ? this.data.umbrella : ''],
    });
    if (this.data)
      this.data.status = this.data?.status == '' || this.data?.status == null ? 'Pending' : this.data?.status;

    this.statusClass = this.data?.status == 'Pending' ? 'badge badge-warning' :
      this.data?.status == 'Approved' ? 'badge badge-success' : 'badge badge-danger'

    this.hostform.disable();
  }

  close() {
    this.dialogRef.close();
  }

  approveHost() {
    this.httpService.httpPost(ApiUrls.host.updateHostStatus, { id: this.data._id, status: "Accepted" }).subscribe((res: any) => {
      if (res['success']) {
        this.dialogRef.close(res);
      }
    });
  }

  rejectHost() {
    const dialogRef = this.modalDialogService.openDialog({
      title: "Reject Host",
      message: "Are you sure you want to reject this host!",
      buttons: [
        { title: "YES", result: "YES", class: "btn-success" },
        { title: "NO", result: "NO", class: "btn-danger" },
      ]
    })
    dialogRef.subscribe(res => {
      if (res == "YES") {
        this.httpService.httpPost(ApiUrls.host.updateHostStatus, { id: this.data._id, status: "Rejected" }).subscribe((res: any) => {
          if (res['success']) {
            this.dialogRef.close(res);
          }
        });
      }
    });
  }


}
