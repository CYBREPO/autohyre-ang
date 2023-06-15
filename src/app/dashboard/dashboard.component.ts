import { Component } from '@angular/core';
import { HttpService } from '../service/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiUrls } from '../constants/apiRoutes';
import { fuel } from '../constants/constant';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ModalDialogService } from '../service/modal-dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  userCount: any;
  
  constructor(private httpService: HttpService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getUsersCount();
  }

  getUsersCount(){
    this.httpService.httpGet(ApiUrls.account.getCount,null).subscribe((res: any) => {
      if(res["success"]){
        this.userCount = res['data']
      }
    })
  }

  // handleAddressChange(address: Address) {
  //   console.log(address.formatted_address)
  //   console.log(address.geometry.location.lat())
  //   console.log(address.geometry.location.lng())
  // }
}
