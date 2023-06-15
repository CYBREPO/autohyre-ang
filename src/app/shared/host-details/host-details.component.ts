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
      user: [this.data != null ? this.data.userName : ''],
      car: [this.data != null ? this.data.car : ''],
      Profile: [''],
      mobilenumber: [this.data != null ? this.data.mobile : ''],
      license: [this.data != null ? this.data.drivingLicense : ''],
      goals: [this.data != null ? this.data.goals : ''],
      availability: [this.data != null ? this.data.carAvailability : ''],
      details: [this.data != null ? this.data.carDetail : ''],
      photos: [''],
      payout: [this.data != null ? this.data.payout : ''],
      qualitystandards: [this.data != null ? this.data.safetyQuantity : ''],
      submityourlisting: [this.data != null ? this.data.submityourlisting : ''],
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
