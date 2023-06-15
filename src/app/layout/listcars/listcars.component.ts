import { Component } from '@angular/core';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listcars',
  templateUrl: './listcars.component.html',
  styleUrls: ['./listcars.component.scss']
})
export class ListcarsComponent {

  data: any;
  domain: string = environment.url;
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getOurLink();
  }

  getOurLink() {
    this.httpService.httpGet(ApiUrls.pages.getOurList, null).subscribe((res: any) => {
      if (res['success']) {
        this.data = res['data'];
      }
    });
  }
}
