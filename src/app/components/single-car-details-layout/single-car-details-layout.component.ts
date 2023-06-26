import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { IUser } from 'src/app/interface/userInterface';
import { DataTransferService } from 'src/app/service/data-transfer.service';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';
import { UserInfoService } from 'src/app/service/user-info.service';
import { CkEditorComponent } from 'src/app/shared/ck-editor/ck-editor.component';
import { QuotesComponent } from '../quotes/quotes.component';
import { environment } from 'src/environments/environment';
import { Carousel } from 'src/app/constants/constant';


@Component({
  selector: 'app-single-car-details-layout',
  templateUrl: './single-car-details-layout.component.html',
  styleUrls: ['./single-car-details-layout.component.scss']
})
export class SingleCarDetailsLayoutComponent {
  
  domain: string = environment.url;
  cardetails: any;
  additionDtls: any;
  dateRange: any;
  user: IUser;
  vehicleId: string;
  customHomeOptions = Carousel.customHomeOptions;

  constructor(private router: Router, private datatransferService: DataTransferService, private httpService: HttpService,
    private userInfoService: UserInfoService, private modalDialogService: ModalDialogService,
    private dialog: MatDialog,private activatedRoute: ActivatedRoute) { 
      activatedRoute.params.subscribe(res => {
        if(res["id"]){
          this.vehicleId = res["id"]
        }
      });
    }

  ngOnInit(): void {
    this.user = this.userInfoService.getLoggedInUser();
    // this.cardetails = this.datatransferService.getData();
    this.getVehicleDetails();
    this.getAdditionalDetails();
  }

  getVehicleDetails(){
    this.httpService.httpPost(ApiUrls.vehicle.getFilteredVehicleDetails,{id: this.vehicleId}).subscribe((res: any) => {
      if(res['success']){
        this.cardetails = res['data'][0];
      }
    });
  }

  getAdditionalDetails() {
    this.httpService.httpGet(ApiUrls.vehicle.getAdditionDetails + "?id=" + this.vehicleId, null).subscribe((res: any) => {
      if(res['success'])
        this.additionDtls = res['data'];
    });
  }
  saveDate() {
    console.log('object');
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
  }

  sendMail() {

    if (this.user == null || this.user == undefined) {
      this.router.navigate(['/account/login'], { queryParams: { returnUrl: this.router.url } })
      return;
    }

    const dialogRef = this.dialog.open(QuotesComponent, {
      height: "80%",
      width: "80%",
      data: this.cardetails
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        let param = {...res,
          vehicleId: this.cardetails._id,
          userDetails: this.user
        }
        this.httpService.httpPost(ApiUrls.mail.sendMail, param).subscribe(res => { });
      }
    });

  }

}
